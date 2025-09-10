import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthService } from "../services/authService";
import { LoginDto, RegisterDto } from "../dtos/auth";

export default function AuthPage() {
    const { login, register } = useAuthService();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isLogin) {
                const dto = new LoginDto(email, password);
                const res = await login(dto);
                localStorage.setItem("token", res.token);
                localStorage.setItem("displayName", res.displayName);
                navigate("/");
            } else {
                const dto = new RegisterDto(email, password, displayName);
                await register(dto);
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-8 text-[#E53A0C]">
                    {isLogin ? "Connexion" : "Inscription"}
                </h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Nom affiché"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#E53A0C]"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#E53A0C]"
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#E53A0C]"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#E53A0C] hover:bg-[#d93700] text-white font-semibold rounded-2xl px-4 py-3 w-full transition-colors duration-200"
                    >
                        {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
                    </button>
                </form>

                <p className="text-center mt-5 text-sm text-gray-600">
                    {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[#E53A0C] ml-2 font-medium hover:underline"
                    >
                        {isLogin ? "Créer un compte" : "Se connecter"}
                    </button>
                </p>
            </div>
        </div>
    );
}