import { useAuthFetch } from "../hooks/useAuthFetch.js";
const API_URL = import.meta.env.VITE_API_URL;

export function useAuthService() {
    const authFetch = useAuthFetch();

    const register = async (registerDto) => {
        const response = await authFetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            body: JSON.stringify(registerDto),
        });

        if (!response?.ok) throw new Error("Erreur lors de l'inscription");
        return await response.json();
    };

    const login = async (loginDto) => {
        const response = await authFetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify(loginDto),
        });

        if (!response?.ok) throw new Error("Erreur lors de la connexion");
        return await response.json();
    };

    return { register, login };
}
