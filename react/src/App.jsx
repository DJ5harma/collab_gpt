import { Route, Routes } from "react-router-dom";
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen";
import Home from "./components/Home/Home";

function App() {
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
