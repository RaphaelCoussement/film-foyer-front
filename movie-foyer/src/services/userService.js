const API_BASE_URL = import.meta.env.VITE_API_URL;

export function useUserService() {
    const getProfile = async (authFetch) => {
        const response = await authFetch(`${API_BASE_URL}/user/me`);
        if (!response.ok) throw new Error("Impossible de récupérer le profil");
        return response.json();
    };

    const updateDisplayName = async (newDisplayName, authFetch) => {
        const response = await authFetch(`${API_BASE_URL}/user/displayName`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newDisplayName }),
        });
        if (!response.ok) throw new Error("Erreur lors de la mise à jour du nom");
        return response.json();
    };

    const changePassword = async (oldPassword, newPassword, authFetch) => {
        const response = await authFetch(`${API_BASE_URL}/user/password`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oldPassword, newPassword }),
        });
        if (!response.ok) throw new Error("Erreur lors du changement de mot de passe");
    };

    // Requêtes utilisateur
    const getUserRequests = async (authFetch) => {
        const response = await authFetch(`${API_BASE_URL}/user/requests`);
        if (!response.ok) throw new Error("Impossible de récupérer les requêtes");
        return response.json();
    };

    // Favoris
    const getFavorites = async (authFetch) => {
        const response = await authFetch(`${API_BASE_URL}/user/favorites`);
        if (!response.ok) throw new Error("Impossible de récupérer les favoris");
        return response.json();
    };

    const addFavorite = async (movieId, authFetch) => {
        const response = await authFetch(`${API_BASE_URL}/user/favorites`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ movieId }),
        });
        if (!response.ok) throw new Error("Erreur lors de l'ajout du favori");
    };

    const removeFavorite = async (movieId, authFetch) => {
        const response = await authFetch(`${API_BASE_URL}/user/favorites/${movieId}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Erreur lors de la suppression du favori");
    };

    return {
        getProfile,
        updateDisplayName,
        changePassword,
        getUserRequests,
        getFavorites,
        addFavorite,
        removeFavorite,
    };
}