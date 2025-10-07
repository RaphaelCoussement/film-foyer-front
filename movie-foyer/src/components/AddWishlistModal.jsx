import { useState, useEffect } from "react";
import { useWishlistService } from "../services/wishlistService";
import { useMovieService } from "../services/movieService";
import { useAuthFetch } from "../hooks/useAuthFetch";
import toast from "react-hot-toast";

export default function AddWishlistModal({ isOpen, onClose, onSuccess }) {
    const [title, setTitle] = useState("");
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    const { addMovie } = useWishlistService();
    const { searchMovies } = useMovieService();
    const authFetch = useAuthFetch();

    // 🔍 Recherche avec délai (debounce)
    useEffect(() => {
        if (!title) {
            setSearchResults([]);
            return;
        }

        const delay = setTimeout(() => {
            handleSearch(title);
        }, 400);

        return () => clearTimeout(delay);
    }, [title]);

    const handleSearch = async (query) => {
        try {
            setSearchLoading(true);
            const results = await searchMovies(query, authFetch);
            setSearchResults(results);
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la recherche du film");
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSelectMovie = (movie) => {
        setSelectedMovie(movie);
        setTitle(movie.title);
        setSearchResults([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedMovie) {
            toast.warning("Choisis un film avant d’ajouter 😉");
            return;
        }

        try {
            setLoading(true);
            await addMovie({ TmdbId: selectedMovie.tmdbId || selectedMovie.id }, authFetch);
            toast.success("Film ajouté à ta wishlist 🎬");
            setTitle("");
            setSelectedMovie(null);
            setError("");
            onSuccess?.();
            onClose();
        } catch (err) {
            toast.error(err.message || "Erreur lors de l’ajout à la wishlist");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 animate-fadeIn relative">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-[#E53A0C]">
                    🎞️ Ajouter à ma Wishlist
                </h2>

                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Titre du film
                        </label>
                        <input
                            type="text"
                            placeholder="Ex: Interstellar"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-[#E53A0C] outline-none transition"
                            required
                        />

                        {searchResults.length > 0 && (
                            <ul className="absolute z-50 bg-white border border-gray-200 rounded-xl mt-2 w-full max-h-72 overflow-y-auto shadow-lg">
                                {searchResults.map((movie) => (
                                    <li
                                        key={movie.id}
                                        className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer transition"
                                        onClick={() => handleSelectMovie(movie)}
                                    >
                                        <img
                                            src={movie.posterUrl || "https://via.placeholder.com/50x75"}
                                            alt={movie.title}
                                            className="w-10 h-14 object-cover rounded-md"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-800">{movie.title}</span>
                                            <span className="text-gray-500 text-sm">
                                                {movie.releaseDate
                                                    ? movie.releaseDate.slice(0, 4)
                                                    : "N/A"}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {searchLoading && (
                            <p className="text-gray-500 text-sm mt-2">Recherche en cours...</p>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-[#E53A0C] hover:bg-[#c7320a] transition text-white rounded-xl px-4 py-2 shadow-md font-medium"
                            disabled={loading}
                        >
                            {loading ? "⏳ Ajout..." : "Ajouter"}
                        </button>
                        <button
                            type="button"
                            className="flex-1 border border-gray-300 hover:bg-gray-100 transition rounded-xl px-4 py-2 font-medium text-gray-700"
                            onClick={onClose}
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}