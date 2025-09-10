import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import {Toaster} from "react-hot-toast";

function App() {
    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <Routes>
                <Route path="/login" element={<AuthPage />} />
                <Route path="/" element={<HomePage />} />
            </Routes>
        </>
    );
}

export default App;