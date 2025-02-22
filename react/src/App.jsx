import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen";
import Home from "./components/Home/Home";
import { useEffect } from "react";
import { useUser } from "./providers/UserProvider";
import { auth_api } from "./utils/axios";
import toast from "react-hot-toast";

function App() {
    const { setUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const userStored = localStorage.getItem("user");
        if (userStored) {
            const userJson = JSON.parse(userStored);
            setUser(userJson);
        }
        auth_api.get("/updated_user").then(({ data }) => {
            console.log(data);

            if (data.error) {
                toast.error(data.error);
                return;
            }

            if (data.user) {
                setUser(data.user);
                toast(data.message);
                navigate({ pathname: "/" });
            } else {
                navigate({ pathname: "/welcome" });
            }
        });
    }, []);

    return (
        <div className="w-screen h-screen border-2 border-red-500 flex justify-center items-center">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/welcome" element={<WelcomeScreen />} />
            </Routes>
        </div>
    );
}
export default App;
