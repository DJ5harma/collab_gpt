import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";

export interface User {
    name: string;
    logo: string;
}

export interface Message {
    sender_name: string; // AI OR USER _id
    content: string;
    createdAt: Date;
}

export interface Room {
    id: string;
    name: string;
    members: Array<{ user: User; access: RoomAccess }>;
    chat_history: Message[];
    join_requesters: User[];
}

enum RoomAccess {
    READ = 0,
    WRITE = 1,
    ADMIN = 2,
}

export interface RoomMap {
    [room_id: string]: {
        my_access: RoomAccess;
        room: Room;
    };
}

const context = createContext<{
    user: User;
    set_user: Dispatch<SetStateAction<User>>;
    token: string;
    set_token: Dispatch<SetStateAction<string>>;
    room_map: RoomMap;
    set_room_map: Dispatch<SetStateAction<RoomMap>>;
}>({
    user: { logo: "", name: "" },
    set_user: () => {},
    token: "",
    set_token: () => {},
    room_map: {},
    set_room_map: () => {},
});

export default function StoreProvider({ children }: { children: ReactNode }) {
    const [user, set_user] = useState<User>({
        name: "",
        logo: "",
    });

    const [token, set_token] = useState("");

    const [room_map, set_room_map] = useState<RoomMap>({});

    useEffect(() => {
        localStorage.setItem("token", token);
    }, [token]);

    return (
        <context.Provider
            value={{ user, set_user, token, set_token, room_map, set_room_map }}
        >
            {children}
        </context.Provider>
    );
}

export const useStore = () => useContext(context);
