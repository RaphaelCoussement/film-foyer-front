import { useNavigate } from "react-router-dom";

export function useAuthFetch() {
    const navigate = useNavigate();

    const authFetch = async (url, options = {}) => {
        const token = localStorage.getItem("token");

        const headers = {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        };

        const response = await fetch(url, { ...options, headers });

        if (response.status === 401) {
            // Token expiré ou non autorisé
            localStorage.removeItem("token");
            localStorage.removeItem("displayName");
            navigate("/login");
            return;
        }

        return response;
    };

    return authFetch;
}
