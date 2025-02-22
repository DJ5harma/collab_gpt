import { useState } from "react";
import { auth_api } from "../../utils/axios";
import toast from "react-hot-toast";
import { useUser } from "../../providers/UserProvider";
import { useCookies } from "react-cookie";

export default function WelcomeScreen() {
    const [userInfo, setUserInfo] = useState({
        name: "",
        password: "",
    });

    const { setUser } = useUser();
    const setCookie = useCookies()[1];

    async function handleSubmit() {
        toast.loading("Taking you in...");
        const res = await auth_api.post("/register", userInfo);
        toast.dismiss();

        const { message, error, user, token } = res.data;
        if (error) return toast.error(error);
        toast.success(message);

        console.log(token, user);

        setCookie("token", token);
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
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
