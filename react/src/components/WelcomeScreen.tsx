import React, { useState } from "react";

export default function WelcomeScreen() {
    const [userInfo, setUserInfo] = useState({
        name: "",
        password: "",
    });

    return (
        <div className="flex flex-col gap-4 items-center">
            <h2>Welcome! I: </h2>

            <button>Am new here!</button>
            <button>Already have an account!</button>

            {/* <input onChange={(e) => e.target.value} placeholder="Unique name" /> */}
        </div>
    );
}
