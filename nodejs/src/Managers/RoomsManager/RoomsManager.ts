import { message_schema, room_schema } from "../../DB/Schemas";

export class RoomsManager {
    private static rooms = new Map<string, Room>(); //roomId, Room

    static async add_room(room_name: string, creator: User) {
        const room = {
            name: room_name,
            members: [{ user: creator!, access: RoomAccess.ADMIN }],
            chat_history: [],
        };

        const new_room = await room_schema.create(room);
        if (!new_room) {
            console.error("Error creating new room");
            return;
        }

        const rm = { ...room, _id: new_room.id() };
        this.rooms.set(rm._id, rm);
        return rm;
    }

    static add_user_to_room(user: User, room_id: string, access: RoomAccess) {
        this.rooms.get(room_id)?.members.push({ access, user });

        room_schema.findByIdAndUpdate(room_id, {
            $push: {
                members: { user: user._id, access },
            },
        });
    }

    static async get_room(room_id: string) {
        const present = this.rooms.get(room_id);

        if (present) return present;

        const room = (await room_schema
            .findById(room_id)
            .populate({
                path: "members.user",
                select: "-hashedPassword -rooms", // Exclude sensitive fields
            })
            .populate({
                path: "chat_history",
                populate: {
                    path: "sender",
                    select: "-hashedPassword -rooms", // Exclude sensitive fields for users
                },
            })
            .exec())!;

        if (!room) {
            console.error("Room not found");
        }

        const rm: Room = {
            _id: room.id(),
            name: room.name,
            chat_history: room.chat_history as unknown as Message[],
            members: room.members as unknown as {
                user: User;
                access: RoomAccess;
            }[],
        };
        this.rooms.set(room_id, rm);

        return rm;
    }

    static has_room(room_id: string) {
        return this.rooms.has(room_id);
    }

    static load_room(room_id: string) {
        if (this.has_room(room_id)) return;

        // Load from DB
    }

    static async add_message_to_room(
        room_id: string,
        senderType: MessageSender,
        sender: string,
        content: string
    ) {
        const message = {
            content,
            senderType,
            sender,
        };

        const new_msg = new message_schema(message);
        await new_msg.save();

        this.rooms.get(room_id)?.chat_history.push({
            ...message,
            _id: new_msg.id(),
            createdAt: new_msg.createdAt,
        });

        room_schema.findByIdAndUpdate(room_id, {
            $push: {
                chat_history: new_msg.id(),
            },
        });
    }
}
