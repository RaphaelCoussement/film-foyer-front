import { useState, useEffect } from "react";
import { ThumbsUp, Plus, Trash2 } from "lucide-react";
import { useRequestService } from "../services/requestService";
import { approveRequest } from "../services/approvalService";
import AddMovieModal from "../components/AddMovieModal";
import toast from "react-hot-toast";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const { getAllRequests, deleteAllRequests } = useRequestService();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const authFetch = useAuthFetch();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        fetchRequests();

    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await getAllRequests(authFetch);
            setRequests(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (id) => {
        try {
            setRequests((prev) => {
                const updated = prev.map((r) =>
                    r.id === id ? { ...r, approvalCount: r.approvalCount + 1 } : r
                );
                return updated.sort((a, b) => b.approvalCount - a.approvalCount);
            });

            // appel API
            await approveRequest(id, authFetch);

            // refresh à jour back (optionnel)
            fetchRequests();

            toast.success("Vote enregistré ✅");
        } catch (err) {
            console.error(err.message);
            toast.error("Erreur : " + err.message);
        }
    };

    const handleClearRequests = async () => {
        try {
            await deleteAllRequests(authFetch);
            toast.success("Toutes les requêtes ont été supprimées ✅");
            setRequests([]);
        } catch (err) {
            toast.error("Erreur : " + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-800 flex flex-col items-center p-4 sm:p-6">
            {/* Header */}
            <header className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide text-[#E53A0C] text-center sm:text-left">
                    Soirée XVDeFrance 🎬
                </h1>

                <div className="flex gap-3">
                    {isAdmin && (
                        <button
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition text-white rounded-xl px-4 py-2 shadow-md"
                            onClick={handleClearRequests}
                        >
                            <Trash2 className="w-5 h-5" />
                            Supprimer tout
                        </button>
                    )}
                    <button
                        className="flex items-center gap-2 bg-[#E53A0C] hover:bg-[#c7320a] transition text-white rounded-xl px-4 py-2 shadow-md"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus className="w-5 h-5" />
                        Proposer un film
                    </button>
                </div>
            </header>

            <AddMovieModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchRequests}
            />

            {/* Liste des suggestions */}
            <section className="w-full max-w-6xl mb-14">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[#E53A0C]">
                    📌 Suggestions en cours
                </h2>

                {requests.length > 0 && (
                    <>
                        {/* Film le plus voté - version cinéma */}
                        <div className="relative w-full mb-12">
                            {/* Fond sombre / gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-gray-900/80 rounded-3xl shadow-xl"></div>

                            <div className="relative flex flex-col sm:flex-row gap-6 p-6 rounded-3xl shadow-2xl bg-white/0 border-2 border-[#E53A0C]">
                                {/* Badge */}
                                <span className="absolute top-4 left-4 bg-[#E53A0C] text-white px-4 py-1 rounded-full font-bold shadow-md z-10">
                    ⭐ Le plus voté
                </span>

                                <img
                                    src={requests[0].movie.posterUrl}
                                    alt={requests[0].movie.title}
                                    className="w-full sm:w-72 h-96 object-cover rounded-xl shadow-lg z-10"
                                />

                                <div className="flex-1 flex flex-col justify-between z-10">
                                    <div>
                                        <h3 className="text-3xl sm:text-4xl font-extrabold mb-2 text-white">
                                            {requests[0].movie.title}{" "}
                                            <span className="text-gray-300 text-xl">({requests[0].movie.year})</span>
                                        </h3>
                                        <p className="text-gray-300 mb-3">
                                            Proposé par : {requests[0].requestedBy || "Anonyme"}
                                        </p>
                                        <p className="text-gray-100 text-lg">
                                            {requests[0].movie.plot}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-6">
                        <span className="text-yellow-400 font-bold text-xl">
                            {requests[0].approvalCount} votes
                        </span>
                                        <button
                                            className="bg-[#E53A0C] hover:bg-[#c7320a] transition text-white rounded-full p-4 shadow-lg"
                                            onClick={() => handleVote(requests[0].id)}
                                        >
                                            <ThumbsUp className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Les autres films */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {requests.slice(1).map((r) => (
                                <div
                                    key={r.id}
                                    className="bg-white rounded-2xl p-4 flex flex-col shadow-sm hover:shadow-md transition"
                                >
                                    <img
                                        src={r.movie.posterUrl}
                                        alt={r.movie.title}
                                        className="w-full h-64 object-cover rounded-xl mb-4 shadow-sm"
                                    />
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-1">
                                                {r.movie.title}{" "}
                                                <span className="text-gray-500">({r.movie.year})</span>
                                            </h3>
                                            <p className="text-gray-500 text-sm mb-2">
                                                Proposé par : {r.requestedBy || "Anonyme"}
                                            </p>
                                            <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                                                {r.movie.plot}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 font-medium">
                                {r.approvalCount} votes
                            </span>
                                            <button
                                                className="bg-[#E53A0C] hover:bg-[#c7320a] transition text-white rounded-full p-2 sm:p-3 shadow-md"
                                                onClick={() => handleVote(r.id)}
                                            >
                                                <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </section>

            {loading && <p className="mt-6 text-gray-500">Chargement...</p>}
        </div>
    );
}