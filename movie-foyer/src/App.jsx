import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import UserProfile from "./pages/UserProfile";
import {Toaster} from "react-hot-toast";

function App() {
    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <Routes>
                <Route path="/login" element={<AuthPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/profile" element={<UserProfile />} />
            </Routes>
        </>
    );
}

export default App;