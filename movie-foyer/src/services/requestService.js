import { useAuthFetch } from "../hooks/useAuthFetch";
const API_URL = import.meta.env.VITE_API_URL;

export function useRequestService() {
    const authFetch = useAuthFetch();

    const getRequestsByDate = async (date) => {
        const res = await authFetch(`${API_URL}/api/request/${date}`);
        if (!res?.ok) throw new Error("Erreur lors de la récupération des films");
        return await res.json(); // liste de RequestDto
    };

    const createRequest = async (title, eventDate) => {
        const body = { title, eventDate };
        const res = await authFetch(`${API_URL}/api/request`, {
            method: "POST",
            body: JSON.stringify(body),
        });
        if (!res?.ok) throw new Error("Erreur lors de la proposition de film");
        return await res.json();
    };

    return { getRequestsByDate, createRequest };
}
