import { useState } from "react";
import { socket } from "../../main";

export default function Welcome() {
    const [details, setDetails] = useState({
        username: "",
    });

    return (
        <div className="flex flex-col gap-4">
            <h1>Welcome!</h1>
            <input
                value={details.username}
                onChange={(e) =>
                    setDetails((p) => ({ ...p, username: e.target.value }))
                }
                placeholder="Unique username"
            />
            <button
                onClick={() => {
                    socket.emit("REGISTER", details.username);
                }}
            >
                Submit
            </button>
        </div>
    );
}
