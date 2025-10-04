const API_BASE_URL = import.meta.env.VITE_API_URL;

export function useRequestService() {
    const getAllRequests = async (authFetch) => {
        const response = await authFetch(`${API_BASE_URL}/request`);
        if (!response.ok) throw new Error("Impossible de récupérer les requêtes");
        return response.json();
    };

    const deleteAllRequests = async (authFetch) => {
        const response = await authFetch(`${API_BASE_URL}/request/clear`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Échec de la suppression");
    };

    // 🔹 Ajout de createRequest
    const createRequest = async (title, authFetch) => {
        const body = { title };
        const response = await authFetch(`${API_BASE_URL}/request`, {
            method: "POST",
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error("Erreur lors de la proposition de film");
        return response.json();
    };

    return { getAllRequests, deleteAllRequests, createRequest };
}
