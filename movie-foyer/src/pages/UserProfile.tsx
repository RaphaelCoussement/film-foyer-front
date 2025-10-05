import { useEffect, useState } from "react";
import { useUserService } from "../services/userService";
import { useAuthFetch } from "../hooks/useAuthFetch";
import toast from "react-hot-toast";
import { Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
    const authFetch = useAuthFetch();
    const navigate = useNavigate();
    const userService = useUserService();

    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState("");
    const [requests, setRequests] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const dataUser = await userService.getProfile(authFetch);
            setUser(dataUser);
            setDisplayName(dataUser.displayName);

            const dataReq = await userService.getUserRequests(authFetch);
            setRequests(dataReq);

            const dataFav = await userService.getFavorites(authFetch);
            setFavorites(dataFav);
        } catch (err) {
            console.error(err);
            toast.error("Erreur lors du chargement du profil");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateDisplayName = async () => {
        try {
            await userService.updateDisplayName(displayName, authFetch);
            toast.success("Nom mis à jour ✅");
            fetchProfile();
        } catch {
            toast.error("Erreur lors de la mise à jour du nom");
        }
    };

    const handleChangePassword = async () => {
        if (!passwordData.oldPassword || !passwordData.newPassword) {
            toast.error("Remplis tous les champs");
            return;
        }
        try {
            await userService.changePassword(passwordData.oldPassword, passwordData.newPassword, authFetch);
            toast.success("Mot de passe changé ✅");
            setPasswordData({ oldPassword: "", newPassword: "" });
        } catch {
            toast.error("Erreur lors du changement de mot de passe");
        }
    };

    const handleRemoveFavorite = async (movieId) => {
        try {
            await userService.removeFavorite(movieId, authFetch);
            toast.success("Film retiré des favoris 🎬");
            fetchProfile();
        } catch {
            toast.error("Erreur lors de la suppression du favori");
        }
    };

    if (loading) return <p className="text-gray-600 mt-10 text-center">Chargement...</p>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-12 flex flex-col items-center">
            {/* Back button */}
            <div className="w-full max-w-4xl mb-6">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-[#E53A0C] font-semibold hover:text-[#c7320a]"
                >
                    <ArrowLeft className="w-5 h-5" /> Retour
                </button>
            </div>

            {/* Card profil */}
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#E53A0C] mb-6 text-center sm:text-left">👤 Mon Profil</h1>

                <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-8">
                    {/* Infos utilisateur */}
                    <div className="flex-1 bg-gray-50 rounded-xl p-4 sm:p-6 shadow-sm">
                        <p className="text-gray-700 mb-2"><b>Email :</b> {user.email}</p>
                    </div>

                    {/* Modifier nom et mot de passe */}
                    <div className="flex-1 flex flex-col gap-4 sm:gap-6">
                        {/* Nom */}
                        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 shadow-sm">
                            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-[#E53A0C]">Modifier le nom</h2>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <input
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 sm:py-2.5"
                                />
                                <button
                                    onClick={handleUpdateDisplayName}
                                    className="bg-[#E53A0C] hover:bg-[#c7320a] text-white rounded-lg px-4 py-2 sm:py-2.5"
                                >
                                    Sauvegarder
                                </button>
                            </div>
                        </div>

                        {/* Mot de passe */}
                        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 shadow-sm">
                            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-[#E53A0C]">Changer le mot de passe</h2>
                            <div className="flex flex-col gap-2 sm:gap-3">
                                {/* Ancien mot de passe */}
                                <div className="relative w-full">
                                    <input
                                        type={showOldPassword ? "text" : "password"}
                                        placeholder="Ancien mot de passe"
                                        value={passwordData.oldPassword}
                                        onChange={(e) =>
                                            setPasswordData({ ...passwordData, oldPassword: e.target.value })
                                        }
                                        className="border border-gray-300 rounded-lg px-3 py-2 sm:py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-[#E53A0C]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    >
                                        {showOldPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>

                                {/* Nouveau mot de passe */}
                                <div className="relative w-full">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Nouveau mot de passe"
                                        value={passwordData.newPassword}
                                        onChange={(e) =>
                                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                                        }
                                        className="border border-gray-300 rounded-lg px-3 py-2 sm:py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-[#E53A0C]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    >
                                        {showNewPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>

                                <button
                                    onClick={handleChangePassword}
                                    className="self-start bg-[#E53A0C] hover:bg-[#c7320a] text-white rounded-lg px-4 py-2 sm:py-2.5"
                                >
                                    Mettre à jour
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Requêtes */}
            <div className="w-full max-w-4xl mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#E53A0C]">📬 Mes Requêtes</h2>
                {requests.length === 0 ? (
                    <p className="text-gray-500">Aucune requête envoyée.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {requests.map((r) => (
                            <div key={r.id} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
                                <p className="font-semibold">{r.movieTitle}</p>
                                <p className="text-gray-500 text-sm">{new Date(r.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Favoris */}
            <div className="w-full max-w-4xl mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#E53A0C]">❤️ Mes Favoris</h2>
                {favorites.length === 0 ? (
                    <p className="text-gray-500">Aucun favori pour le moment.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                        {favorites.map((f) => (
                            <div key={f.imdbId} className="bg-white rounded-2xl shadow hover:shadow-lg overflow-hidden">
                                <img src={f.posterUrl} alt={f.title} className="w-full h-64 object-cover" />
                                <div className="p-3 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{f.title}</h3>
                                        <p className="text-sm text-gray-500">{f.year}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveFavorite(f.id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}