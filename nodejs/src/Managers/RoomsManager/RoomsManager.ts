export class RoomsManager {
	static ctr = 0;
	static rooms: { [room_id: string]: Room };

	static add_room(room_id: string, room_name: string, creator: User) {
		this.rooms[room_id] = {
			id: room_id,
			chat_history: [],
			name: room_name,
			members: [{ access: RoomAccess.ADMIN, user: creator }],
		};
		// add to DB
	}

	static load_room(room_id: string) {
		if (this.rooms[room_id]) return;

		// Load from DB
	}

	static add_message_to_room(room_id: string, message: Message) {
		this.rooms[room_id].chat_history.push(message);

		// add to DB
	}
}
