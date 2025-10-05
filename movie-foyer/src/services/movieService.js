const API_BASE_URL = import.meta.env.VITE_API_URL;

export function useMovieService() {
    const searchMovies = async (query, authFetch) => {
        const response = await authFetch(
            `${API_BASE_URL}/movie/search?title=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error("Erreur lors de la recherche des films");
        }

        return response.json();
    };

    return { searchMovies };
}
