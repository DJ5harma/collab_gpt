declare global {
	interface User {
		id: string;
		name: string;
		logo: string;
		rooms: Array<Room>;
		password: string;
	}
	var User: User;

	interface AI {
		id: string;
		name: string;
		logo: string;
	}
	var AI: AI;

	interface Room {
		id: string;
		name: string;
		members: Array<{ user: User; access: RoomAccess }>;
		chat_history: Message[];
	}
	var Room: Room;
	enum RoomAccess {
		READ = 0,
		WRITE = 1,
		ADMIN = 2,
	}

	type Message = Array<{
		sender: User | AI;
		senderType: MessageSender;
		content: string;
		createdAt: Date;
	}>;
	var Message: Message;
	enum MessageSender {
		USER = 0,
		AI = 1,
		ADMIN = 2,
	}
}

export {};
