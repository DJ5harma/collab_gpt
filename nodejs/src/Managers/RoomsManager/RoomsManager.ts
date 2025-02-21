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

		const rm = { ...room, id: new_room.id() };
		this.rooms.set(rm.id, rm);
		return rm;
	}

	static add_user_to_room(user: User, room_id: string, access: RoomAccess) {
		this.rooms.get(room_id)?.members.push({ access, user });

		room_schema.findByIdAndUpdate(room_id, {
			$push: {
				members: { user: user.id, access },
			},
		});
	}

	static get_room(room_id: string) {
		return this.rooms.get(room_id);
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
			id: new_msg.id(),
			createdAt: new_msg.createdAt,
		});

		room_schema.findByIdAndUpdate(room_id, {
			$push: {
				chat_history: new_msg.id(),
			},
		});
	}
}
