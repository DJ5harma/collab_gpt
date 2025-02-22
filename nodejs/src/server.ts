import { error } from "console";
import { config } from "dotenv";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";
import { randomUUID } from "crypto";

config();
const PORT = Number(process.env.PORT);
const JWT_SECRET = process.env.JWT_SECRET!;

const io = new Server();
io.listen(PORT!);

//-------------------------

const username_to_user = new Map<string, User>();

const rid_to_room = new Map<string, Room>();

const sendable = ({
    user,
    room,
    message,
}: {
    user?: User;
    room?: Room;
    message?: Message;
}) => {
    let res: any;

    if (user)
        res = {
            logo: user.logo,
            name: user.name,
            rooms: user.rooms,
        } as User;
    else if (room) res = room;
    else if (message) res = message;
    return res;
};

const verify = (token: string) => {
    const username = jwt.verify(token, JWT_SECRET) as string;
    if (!username) {
        error("invalid token");
        return;
    }
    const user = username_to_user.get(username);
    if (!user) {
        error("user not found");
        return;
    }
    return user;
};

io.on("connection", (socket) => {
    socket.on("REGISTER", (username: string) => {
        if (username_to_user.has(username))
            return socket.emit("error", "username already present");

        const user = {
            name: username,
            logo: createAvatar(lorelei, {
                seed: username,
                // ... other options
            }).toString(),
            rooms: [],
            socket,
        } as User;
        username_to_user.set(username, user);

        const token = jwt.sign(username, JWT_SECRET) as string;
        if (!token) return error("token not created");

        socket.emit("SAVE-DETAILS", [token, sendable({ user })]);
    });

    socket.on("CREATE-ROOM", (token: string, name?: string) => {
        const user = verify(token);
        if (!user) return;

        const room_id = randomUUID();

        const access = RoomAccess.ADMIN;
        const room = {
            name: name || `Untitled ${new Date()}`,
            members: [{ user, access }],
            chat_history: [],
            join_requesters: [],
        };
        rid_to_room.set(room_id, room);
        socket.join(room_id);

        socket.emit("CREATED-ROOM", [sendable({ room }), access]);
    });

    socket.on("JOIN-ROOM", (token: string, room_id: string) => {
        const room = rid_to_room.get(room_id);
        if (!room) return error("room not found");

        const user = verify(token);
        if (!user) return;

        for (let i = 0; i < room.members.length; ++i) {
            if (room.members[i].user === user) {
                const access = room.members[i].access;

                user.socket.join(room_id);
                user.socket.emit("JOINED-ROOM", [sendable({ room }), access]);
                user.rooms.push(room);
                return;
            }
        }

        room.members
            .filter(({ access }) => access === RoomAccess.ADMIN)
            .forEach((member) => {
                member.user.socket.emit("JOIN-REQUEST", sendable({ user }));
            });

        room.join_requesters.push(user);
    });

    socket.on(
        "ACCEPT-JOIN-REQUEST",
        (
            token: string,
            room_id: string,
            requester_username: string,
            access: RoomAccess
        ) => {
            const user = verify(token);
            if (!user) return;

            const room = rid_to_room.get(room_id);
            if (!room) return error("room not found");

            const requester = username_to_user.get(requester_username);
            if (!requester) return error("requester not found");

            if (!room.members.includes({ access: RoomAccess.ADMIN, user }))
                return error("A non admin wanted to add a requester");

            requester.socket.join(room_id);
            requester.socket.emit("JOINED-ROOM", [sendable({ room }), access]);

            room.members.push({ user: requester, access });
            requester.rooms.push(room);
            room.join_requesters = room.join_requesters.filter(
                (user) => user !== requester
            );
        }
    );

    socket.on(
        "SEND-MESSAGE",
        (token: string, content: string, room_id: string) => {
            const user = verify(token);
            if (!user) return;

            const room = rid_to_room.get(room_id);
            if (!room) return error("room not found");

            const members = room.members;

            for (let i = 0; i < members.length; ++i) {
                if (user === members[i].user) {
                    if (members[i].access === RoomAccess.READ) return;

                    const message = {
                        content,
                        createdAt: new Date(),
                        sender_name: user.name,
                    };
                    room.chat_history.push(message);

                    room.members.forEach(({ user }) => {
                        user.socket.emit("NEW-MESSAGE", [
                            room_id,
                            sendable({ message }),
                        ]);
                    });
                    return;
                }
            }
        }
    );
});
