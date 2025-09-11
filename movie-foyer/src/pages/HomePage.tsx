import { useState, useEffect } from "react";
import { ThumbsUp, Plus } from "lucide-react";
import { useRequestService } from "../services/requestService";
import { approveRequest } from "../services/approvalService";
import { getNextSaturday, isSaturday } from "../utils/dateUtils";
import AddMovieModal from "../components/AddMovieModal";
import toast from "react-hot-toast";

export default function HomePage() {
    const { getRequestsByDate } = useRequestService();
    const [selectedDate, setSelectedDate] = useState(getNextSaturday());
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchRequests(selectedDate);
    }, [selectedDate]);

    const fetchRequests = async (date) => {
        try {
            setLoading(true);
            const data = await getRequestsByDate(date);
            setRequests(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Utilisateur non connecté");

            await approveRequest(id, token);

            setRequests((prev) =>
                prev.map((r) =>
                    r.id === id ? { ...r, approvalCount: r.approvalCount + 1 } : r
                )
            );

            toast.success("Vote enregistré ✅");
        } catch (err) {
            console.error(err.message);
            toast.error(err.message);
        }
    };

    const winner =
        requests.length > 0
            ? requests.reduce((max, r) =>
                r.approvalCount > max.approvalCount ? r : max
            )
            : null;

    const handleDateChange = (e) => {
        const date = e.target.value;
        if (isSaturday(date)) setSelectedDate(date);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-800 flex flex-col items-center p-4 sm:p-6">
            {/* Header */}
            <header className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide text-[#E53A0C] text-center sm:text-left">
                    FilmFoyerPGF 🎬
                </h1>
                <button
                    className="flex items-center gap-2 bg-[#E53A0C] hover:bg-[#c7320a] transition text-white rounded-xl px-4 sm:px-5 py-2 shadow-md w-full sm:w-auto justify-center"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus className="w-5 h-5" />
                    Proposer un film
                </button>
            </header>

            <AddMovieModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => fetchRequests(selectedDate)}
            />

            {/* Sélecteur de date */}
            <section className="w-full max-w-6xl mb-10">
                <label className="block mb-2 text-base sm:text-lg font-medium text-gray-700">
                    Choisir un samedi :
                </label>
                <input
                    type="date"
                    className="w-full sm:w-64 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E53A0C]"
                    value={selectedDate}
                    onChange={handleDateChange}
                />
            </section>

            <section className="w-full max-w-6xl mb-14">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[#E53A0C]">
                    🎥 Film du samedi
                </h2>
                {winner ? (
                    <div className="bg-white shadow-md rounded-2xl p-5 sm:p-8 flex flex-col lg:flex-row items-center gap-8 hover:shadow-lg transition">
                        <img
                            src={winner.movie.posterUrl}
                            alt={winner.movie.title}
                            className="w-40 sm:w-48 lg:w-56 rounded-xl shadow-md object-cover"
                        />
                        <div className="text-center lg:text-left flex-1">
                            <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">
                                {winner.movie.title}{" "}
                                <span className="text-gray-500">({winner.movie.year})</span>
                            </h3>
                            <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed max-w-2xl">
                                {winner.movie.plot}
                            </p>
                            <p className="text-sm text-gray-500 font-medium">
                                Avec {winner.approvalCount} votes
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Aucun film proposé pour cette date.</p>
                )}
            </section>

            {/* Suggestions desktop */}
            <section className="w-full max-w-6xl">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[#E53A0C]">
                    📌 Suggestions de la semaine
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {requests
                        .sort((a, b) => b.approvalCount - a.approvalCount)
                        .map((r) => (
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
            </section>

            {loading && <p className="mt-6 text-gray-500">Chargement...</p>}
        </div>
    );
}