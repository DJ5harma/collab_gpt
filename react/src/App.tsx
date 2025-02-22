import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Welcome from "./Pages/Welcome/Welcome";
import StoreProvider from "./Store/StoreProvider";
import { Toaster } from "react-hot-toast";
import SocketListener from "./Managers/SocketListener";

function App() {
    return (
        <>
            <Toaster />
            <StoreProvider>
                <SocketListener />
                <BrowserRouter>
                    <div className="w-screen h-screen border-2 border-red-500 flex justify-center items-center">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/welcome" element={<Welcome />} />
                        </Routes>
                    </div>
                </BrowserRouter>
            </StoreProvider>
        </>
    );
}

export default App;
