import React, { useState } from "react";
import { auth_api } from "../utils/axios";
import toast from "react-hot-toast";
import { useUser } from "../providers/UserProvider";

export default function WelcomeScreen() {
    const [userInfo, setUserInfo] = useState({
        name: "",
        password: "",
    });

    const { setUser } = useUser();

    async function handleSubmit() {
        toast.loading("Taking you in...");
        const res = await auth_api.post("/register", userInfo);
        toast.dismiss();

        const { message, error, user } = res.data;
        if (error) return toast.error(error);
        toast.success(message);

        setUser(user);
        console.log({ user });
    }

    return (
        <div className="flex flex-col gap-4 items-center">
            <h2>Welcome!</h2>

            <input
                onChange={(e) =>
                    setUserInfo((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Username"
            />
            <input
                onChange={(e) =>
                    setUserInfo((p) => ({ ...p, password: e.target.value }))
                }
                placeholder="Password"
            />

            <button onClick={handleSubmit}>Login or SignUp</button>
        </div>
    );
}
