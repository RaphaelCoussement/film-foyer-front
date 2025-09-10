const API_URL = import.meta.env.VITE_API_URL;

export async function approveRequest(requestId, token) {
    const response = await fetch(`${API_URL}/api/approvals/${requestId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'approbation");
    }

    return await response.json();
}
