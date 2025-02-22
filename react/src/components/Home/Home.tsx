import { useUser } from "../../providers/UserProvider";

const PreviousRooms = () => {
    const { user } = useUser();
    // const { rooms } = user;
    const rooms = [
        {
            _id: "room id dadikanfdin",
            name: "room name",
            members: [],
            chat_history: [],
        },
    ];
    return (
        <div className="w-full p-2">
            {rooms.map(({ _id, name, members, chat_history }) => {
                return <div key={_id} className="w-full"></div>;
            })}
        </div>
    );
};

export default function Home() {
    return <div className="w-full h-full">Home</div>;
}
