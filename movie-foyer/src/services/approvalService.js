const API_URL = import.meta.env.VITE_API_URL;

export async function approveRequest(requestId, authFetch) {
    const response = await authFetch(`${API_URL}/approvals/${requestId}`, {
        method: "POST"
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'approbation");
    }

    return response.json();
}
