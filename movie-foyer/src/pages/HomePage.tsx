import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Plus, Trash2, X, User, Heart } from "lucide-react";
import { useRequestService } from "../services/requestService";
import { approveRequest, unapproveRequest, getUserApprovals } from "../services/approvalService";
import { useUserService } from "../services/userService";
import AddMovieModal from "../components/AddMovieModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import toast from "react-hot-toast";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { useNavigate } from "react-router-dom";
import { formatDuration } from "../utils/timeUtils";

export default function HomePage() {
    const { getAllRequests, deleteAllRequests, deleteRequest } = useRequestService();
    const userService = useUserService();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ open: false, id: null, title: "" });

    const authFetch = useAuthFetch();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const currentUser = localStorage.getItem("displayName");

    const [userVotes, setUserVotes] = useState([]);

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchRequestsAndVotes();
    }, []);

    const fetchRequestsAndVotes = async () => {
        try {
            setLoading(true);
            const [requestsData, approvalsData] = await Promise.all([
                getAllRequests(authFetch),
                getUserApprovals(authFetch)
            ]);

            setRequests(requestsData);

            setUserVotes(approvalsData);
        } catch (err) {
            console.error("Erreur lors du chargement :", err);
            toast.error("Impossible de charger les données");
        } finally {
            setLoading(false);
        }
    };

    const handleVoteToggle = async (id) => {
        const hasVoted = userVotes.includes(id);

        try {
            if (hasVoted) {
                // Dévote
                setUserVotes((prev) => prev.filter((rId) => rId !== id));
                setRequests((prev) =>
                    prev
                        .map((r) =>
                            r.id === id ? { ...r, approvalCount: r.approvalCount - 1 } : r
                        )
                        .sort((a, b) => b.approvalCount - a.approvalCount)
                );
                await unapproveRequest(id, authFetch);
                toast.success("Vote retiré 👎");
            } else {
                // Vote
                setUserVotes((prev) => [...prev, id]);
                setRequests((prev) =>
                    prev
                        .map((r) =>
                            r.id === id ? { ...r, approvalCount: r.approvalCount + 1 } : r
                        )
                        .sort((a, b) => b.approvalCount - a.approvalCount)
                );
                await approveRequest(id, authFetch);
                toast.success("Vote enregistré 👍");
            }

            fetchRequestsAndVotes();
        } catch (err) {
            console.error(err.message);
            toast.error("Erreur : " + err.message);
        }
    };

    const handleAddFavorite = async (movieId) => {
        try {
            await userService.addFavorite(movieId, authFetch);
            toast.success("Film ajouté aux favoris ❤️");
        } catch (err) {
            toast.error("Erreur lors de l'ajout au favori");
            console.error(err);
        }
    };

    const handleDeleteRequest = async (id) => {
        try {
            await deleteRequest(id, authFetch);
            toast.success("Requête supprimée ✅");
            setRequests((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            toast.error("Erreur : " + err.message);
        } finally {
            setConfirmModal({ open: false, id: null, title: "" });
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
            <header className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 px-2 sm:px-0">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide text-[#E53A0C] text-center sm:text-left">
                    Soirée XVDeFrance 🎬
                </h1>
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-end w-full sm:w-auto">
                    {isAdmin && (
                        <button
                            className="flex items-center gap-1 sm:gap-2 bg-red-600 hover:bg-red-700 transition text-white rounded-xl px-3 sm:px-4 py-2 shadow-md text-sm sm:text-base cursor-pointer"
                            onClick={handleClearRequests}
                        >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            Supprimer tout
                        </button>
                    )}
                    <button
                        className="flex items-center gap-1 sm:gap-2 bg-[#E53A0C] hover:bg-[#c7320a] transition text-white rounded-xl px-3 sm:px-4 py-2 shadow-md text-sm sm:text-base cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        Proposer un film
                    </button>
                    <button
                        className="flex items-center gap-1 sm:gap-2 bg-gray-800 hover:bg-gray-900 transition text-white rounded-xl px-3 sm:px-4 py-2 shadow-md cursor-pointer text-sm sm:text-base"
                        onClick={() => navigate("/profile")}
                    >
                        <User className="w-4 h-4 sm:w-5 sm:h-5" />
                        Profil
                    </button>
                </div>
            </header>

            <AddMovieModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchRequestsAndVotes}
            />

            {/* Liste des suggestions */}
            <section className="w-full max-w-6xl mb-14">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[#E53A0C]">
                    📌 Suggestions en cours
                </h2>

                {requests.length > 0 && (
                    <>
                        {/* Film le plus voté */}
                        <div className="relative w-full mb-12">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-gray-900/80 rounded-3xl shadow-xl"></div>

                            <div className="relative flex flex-col sm:flex-row gap-6 p-6 rounded-3xl shadow-2xl bg-white/0 border-2 border-[#E53A0C] z-10">
                                <span className="absolute top-4 left-4 bg-[#E53A0C] text-white px-4 py-1 rounded-full font-bold shadow-md z-10">
                                    ⭐ Le plus voté
                                </span>

                                {/* Croix pour le créateur */}
                                {requests[0].requestedBy === currentUser && (
                                    <button
                                        className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-red-600/80 hover:bg-red-700 transition text-white rounded-full p-2.5 sm:p-2 shadow-lg active:scale-95 cursor-pointer z-20"
                                        onClick={() =>
                                            setConfirmModal({
                                                open: true,
                                                id: requests[0].id,
                                                title: requests[0].movie.title,
                                            })
                                        }
                                    >
                                        <X className="w-6 h-6 sm:w-5 sm:h-5" />
                                    </button>
                                )}

                                <img
                                    src={requests[0].movie.posterUrl}
                                    alt={requests[0].movie.title}
                                    className="w-full sm:w-72 h-96 object-cover rounded-xl shadow-lg z-10"
                                />

                                <div className="flex-1 flex flex-col justify-between z-10">
                                    <div>
                                        <h3 className="text-3xl sm:text-4xl font-extrabold mb-2 text-white">
                                            {requests[0].movie.title}{" "}
                                            <span className="text-gray-300 text-xl">
                                                ({requests[0].movie.year})
                                                {requests[0].movie.duration
                                                    ? ` • ${formatDuration(
                                                        requests[0].movie.duration
                                                    )}`
                                                    : ""}
                                            </span>
                                        </h3>
                                        <p className="text-gray-300 mb-3">
                                            Proposé par : {requests[0].requestedBy || "Anonyme"}
                                        </p>
                                        <p className="text-gray-100 text-lg">
                                            {requests[0].movie.plot}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-6 gap-4">
                                        <span className="text-yellow-400 font-bold text-xl">
                                            {requests[0].approvalCount} votes
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                className={`${
                                                    userVotes.includes(requests[0].id)
                                                        ? "bg-gray-500 hover:bg-gray-600"
                                                        : "bg-[#E53A0C] hover:bg-[#c7320a]"
                                                } transition text-white rounded-full p-4 shadow-lg cursor-pointer`}
                                                onClick={() =>
                                                    handleVoteToggle(requests[0].id)
                                                }
                                            >
                                                {userVotes.includes(requests[0].id) ? (
                                                    <ThumbsDown className="w-6 h-6 cursor-pointer" />
                                                ) : (
                                                    <ThumbsUp className="w-6 h-6 cursor-pointer" />
                                                )}
                                            </button>
                                            <button
                                                className="bg-[#F59E0B] hover:bg-[#d97b04] transition text-white rounded-full p-4 shadow-lg cursor-pointer"
                                                onClick={() =>
                                                    handleAddFavorite(requests[0].movie.id)
                                                }
                                            >
                                                <Heart className="w-6 h-6 cursor-pointer" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Autres films */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {requests.slice(1).map((r) => (
                                <div
                                    key={r.id}
                                    className="relative bg-white rounded-2xl p-3 sm:p-4 flex flex-col shadow-sm hover:shadow-md transition w-full"
                                >
                                    {r.requestedBy === currentUser && (
                                        <button
                                            className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-600/90 hover:bg-red-700 transition text-white rounded-full p-2 shadow-md active:scale-95 cursor-pointer z-20"
                                            onClick={() =>
                                                setConfirmModal({
                                                    open: true,
                                                    id: r.id,
                                                    title: r.movie.title,
                                                })
                                            }
                                        >
                                            <X className="w-5 h-5 sm:w-4 sm:h-4" />
                                        </button>
                                    )}

                                    <img
                                        src={r.movie.posterUrl}
                                        alt={r.movie.title}
                                        className="w-full sm:h-64 h-48 object-cover rounded-xl mb-3 sm:mb-4 shadow-sm"
                                    />
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-1">
                                                {r.movie.title}{" "}
                                                <span className="text-gray-500 text-xs sm:text-sm">
                                                    ({r.movie.year})
                                                    {r.movie.duration
                                                        ? ` • ${formatDuration(
                                                            r.movie.duration
                                                        )}`
                                                        : ""}
                                                </span>
                                            </h3>
                                            <p className="text-gray-500 text-xs sm:text-sm mb-1">
                                                Proposé par : {r.requestedBy || "Anonyme"}
                                            </p>
                                            <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 mb-2 sm:mb-3">
                                                {r.movie.plot}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-gray-700 font-medium text-sm sm:text-base">
                                                {r.approvalCount} votes
                                            </span>
                                            <div className="flex gap-2">
                                                <button
                                                    className={`${
                                                        userVotes.includes(r.id)
                                                            ? "bg-gray-500 hover:bg-gray-600"
                                                            : "bg-[#E53A0C] hover:bg-[#c7320a]"
                                                    } transition text-white rounded-full p-2 sm:p-3 shadow-md cursor-pointer`}
                                                    onClick={() =>
                                                        handleVoteToggle(r.id)
                                                    }
                                                >
                                                    {userVotes.includes(r.id) ? (
                                                        <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    ) : (
                                                        <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    )}
                                                </button>
                                                <button
                                                    className="bg-[#F59E0B] hover:bg-[#d97b04] transition text-white rounded-full p-2 sm:p-3 shadow-md cursor-pointer"
                                                    onClick={() =>
                                                        handleAddFavorite(r.movie.id)
                                                    }
                                                >
                                                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </section>

            <ConfirmDeleteModal
                isOpen={confirmModal.open}
                onClose={() => setConfirmModal({ open: false, id: null, title: "" })}
                onConfirm={() => handleDeleteRequest(confirmModal.id)}
                title={confirmModal.title}
            />

            {loading && <p className="mt-6 text-gray-500">Chargement...</p>}
        </div>
    );
}