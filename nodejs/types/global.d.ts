import { Socket } from "socket.io";

declare global {
    interface User {
        name: string;
        logo: string;
        rooms: Array<Room>;
        socket: Socket;
    }
    var User: User;

    interface AI {
        name: string;
        logo: string;
    }
    var AI: AI;

    interface Room {
        id: string;
        name: string;
        members: Array<{ user: User; access: RoomAccess }>;
        chat_history: Message[];
        join_requesters: User[];
    }
    var Room: Room;
    enum RoomAccess {
        READ = 0,
        WRITE = 1,
        ADMIN = 2,
    }

    interface Message {
        sender_name: string; // AI OR USER _id
        content: string;
        createdAt: Date;
    }
    var Message: Message;
}

export {};
