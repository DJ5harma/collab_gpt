declare global {
    interface User {
        _id: string;
        name: string;
        logo: string;
        rooms: Array<Room>;
    }
    var User: User;

    interface AI {
        _id: string;
        name: string;
        logo: string;
    }
    var AI: AI;

    interface Room {
        _id: string;
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

    type Message = {
        _id: string;
        sender: string; // AI OR USER _id
        senderType: MessageSender;
        content: string;
        createdAt: Date;
    };
    var Message: Message;
    enum MessageSender {
        USER = 0,
        AI = 1,
        ADMIN = 2,
    }
}

export {};
