import { useEffect } from "react";
import { socket } from "../main";
import { RoomMap, User, useStore } from "../Store/StoreProvider";
import toast from "react-hot-toast";

export default function SocketListener() {
    const { set_user, set_token, room_map, set_room_map } = useStore();

    useEffect(() => {
        socket.on("SAVE-DETAILS", ([token, user]) => {
            const usr: User = { name: user.name, logo: user.logo };

            set_user(usr);
            set_token(token);
            toast("Saved details");
        });

        socket.on("CREATED-ROOM", ([room, access]) => {
            const new_room_map: RoomMap = {
                ...room_map,
                [room.id]: { my_access: access, room },
            };

            set_room_map(new_room_map);
            toast(`created ${room.name} and joined as ${access}`);
        });

        socket.on("JOINED-ROOM", ([room, access]) => {
            const new_room_map: RoomMap = {
                ...room_map,
                [room.id]: { my_access: access, room },
            };
            set_room_map(new_room_map);
            toast(`joined ${room.name} and joined as ${access}`);
        });

        return () => {
            socket.removeAllListeners();
        };
    }, []);

    return <div>SocketListener</div>;
}
