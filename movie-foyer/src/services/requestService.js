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

    const deleteRequest = async (id, authFetch) => {
        const response = await authFetch(`${API_BASE_URL}/request/user/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Échec de la suppression");
    };

    const createRequest = async (data, authFetch) => {
        const response = await authFetch(`${API_BASE_URL}/request`, {
            method: "POST",
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Erreur lors de la proposition de film");
        return response.json();
    };

    return { getAllRequests, deleteAllRequests, createRequest, deleteRequest };
}