import { log } from "console";
import { Server, Socket } from "socket.io";
import { RoomsManager } from "../RoomsManager/RoomsManager";

export class SocketManager {
    static io: Server;

    static userid_to_socket = new Map<string, Socket>();

    static init(io: Server) {
        this.io = io;
        log(SocketManager.name, "init");

        this.io.on("connection", (socket) => {
            log(socket.id, "connected");

            socket.on("register-my-socket", (user_id) => {
                this.userid_to_socket.set(user_id, socket);
            });

            socket.on(
                "accepted-room-join-request",
                async ({
                    room_id,
                    user,
                    joiner_access,
                }: {
                    room_id: string;
                    user: User;
                    joiner_access: RoomAccess;
                }) => {
                    const rm = await RoomsManager.get_room(room_id);
                    rm.members
                        .filter(({ access }) => access === RoomAccess.ADMIN)
                        .forEach((member) => {
                            if (
                                socket ===
                                this.userid_to_socket.get(member.user._id)
                            ) {
                                this.userid_to_socket
                                    .get(user._id)
                                    ?.join(room_id);
                                RoomsManager.add_user_to_room(
                                    user,
                                    room_id,
                                    joiner_access
                                );
                                return;
                            }
                        });
                }
            );

            socket.on(
                "send-message",
                async ({
                    user_id,
                    content,
                    room_id,
                }: {
                    user_id: string;
                    content: string;
                    room_id: string;
                }) => {
                    const rm = await RoomsManager.get_room(room_id);
                    rm?.members
                        .filter(
                            ({ access }) =>
                                access === RoomAccess.ADMIN ||
                                access === RoomAccess.WRITE
                        )
                        .forEach((member) => {
                            if (member.user?._id === user_id) {
                                const senderType =
                                    member.access === RoomAccess.ADMIN
                                        ? MessageSender.ADMIN
                                        : MessageSender.USER;

                                const msg = RoomsManager.add_message_to_room(
                                    room_id,
                                    senderType,
                                    user_id,
                                    content
                                );

                                socket.broadcast
                                    .to(room_id)
                                    .emit("new-message", { user_id, msg });
                                return;
                            }
                        });
                }
            );
        });
    }

    static async emit_join_room_request(room_id: string, user: User) {
        const room = await RoomsManager.get_room(room_id);
        if (!room) return;
        room?.members
            .filter(({ access }) => access === RoomAccess.ADMIN)
            .forEach((member) => {
                this.userid_to_socket
                    .get(member.user._id)
                    ?.emit("room-join-request", user);
            });
    }
}
