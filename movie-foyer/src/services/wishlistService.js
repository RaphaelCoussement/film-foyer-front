export function useWishlistService() {
    const API_URL = import.meta.env.VITE_API_URL;

    const getAll = async (authFetch) => {
        const res = await authFetch(`${API_URL}/wishlist`);
        if (!res.ok) throw new Error("Erreur lors du chargement de la wishlist");
        return res.json();
    };

    const addMovie = async (body, authFetch) => {
        const res = await authFetch(`${API_URL}/wishlist`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Erreur lors de l'ajout à la wishlist");
        return res.json();
    };

    const removeMovie = async (id, authFetch) => {
        const res = await authFetch(`${API_URL}/wishlist/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Erreur lors de la suppression du film de la wishlist");
    };

    const suggestMovie = async (id, authFetch) => {
        const res = await authFetch(`${API_URL}/wishlist/suggest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ movieId: id }),
        });
        if (!res.ok) throw new Error("Erreur lors de la suggestion du film");
        return res.json(); // retourne la request créée
    };

    return { getAll, addMovie, removeMovie, suggestMovie };
}
