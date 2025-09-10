// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { ThumbsUp } from "lucide-react";
//
// export default function HomePage() {
//     const [selectedDate, setSelectedDate] = useState("2025-09-13");
//
//     // Exemple de données mockées avec affiche, année et description
//     const [movies, setMovies] = useState([
//         {
//             id: 1,
//             title: "Inception",
//             year: 2010,
//             description: "Un voleur s'infiltre dans les rêves pour dérober des secrets.",
//             poster: "https://image.tmdb.org/t/p/w200/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
//             votes: 8,
//             date: "2025-09-13",
//         },
//         {
//             id: 2,
//             title: "Interstellar",
//             year: 2014,
//             description: "Un groupe d'explorateurs voyage à travers un trou de ver.",
//             poster: "https://image.tmdb.org/t/p/w200/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
//             votes: 5,
//             date: "2025-09-13",
//         },
//         {
//             id: 3,
//             title: "The Dark Knight",
//             year: 2008,
//             description: "Batman affronte le Joker dans une lutte pour Gotham.",
//             poster: "https://image.tmdb.org/t/p/w200/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
//             votes: 12,
//             date: "2025-09-20",
//         },
//     ]);
//
//     // Filtrer les films par date sélectionnée
//     const filteredMovies = movies.filter((m) => m.date === selectedDate);
//
//     // Film gagnant pour la date sélectionnée
//     const winner = filteredMovies.length > 0 ? filteredMovies.reduce((max, movie) => movie.votes > max.votes ? movie : max) : null;
//
//     const handleVote = (id) => {
//         setMovies((prev) => prev.map((m) => (m.id === id ? { ...m, votes: m.votes + 1 } : m)));
//     };
//
//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
//             {/* Header */}
//             <header className="w-full max-w-4xl flex justify-between items-center mb-10">
//                 <h1 className="text-3xl font-bold text-[#E53A0C]">MovieNight 🎬</h1>
//                 <Button className="bg-[#E53A0C] text-white rounded-2xl px-4 py-2">Proposer un film</Button>
//             </header>
//
//             {/* Sélecteur de date */}
//             <section className="w-full max-w-4xl mb-8">
//                 <label className="block mb-2 font-medium">Choisir un samedi :</label>
//                 <input
//                     type="date"
//                     className="border rounded-lg px-3 py-2"
//                     value={selectedDate}
//                     onChange={(e) => setSelectedDate(e.target.value)}
//                 />
//             </section>
//
//             {/* Film du samedi */}
//             <section className="w-full max-w-4xl mb-12">
//                 <h2 className="text-xl font-semibold mb-4">Film du samedi</h2>
//                 {winner ? (
//                     <Card className="shadow-md rounded-2xl">
//                         <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
//                             <img src={winner.poster} alt={winner.title} className="w-32 rounded-lg shadow" />
//                             <div>
//                                 <motion.h3 className="text-2xl font-bold mb-2" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
//                                     {winner.title} ({winner.year})
//                                 </motion.h3>
//                                 <p className="text-gray-600 mb-2">{winner.description}</p>
//                                 <p className="text-gray-500">Avec {winner.votes} votes</p>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 ) : (
//                     <p>Aucun film proposé pour cette date.</p>
//                 )}
//             </section>
//
//             {/* Liste des films proposés */}
//             <section className="w-full max-w-4xl">
//                 <h2 className="text-xl font-semibold mb-4">Suggestions de cette semaine</h2>
//                 <div className="grid gap-4">
//                     {filteredMovies.sort((a, b) => b.votes - a.votes).map((movie) => (
//                         <Card key={movie.id} className="rounded-2xl shadow-sm">
//                             <CardContent className="p-4 flex gap-4 items-center">
//                                 <img src={movie.poster} alt={movie.title} className="w-20 rounded-md shadow" />
//                                 <div className="flex-1">
//                                     <h3 className="text-lg font-semibold">{movie.title} ({movie.year})</h3>
//                                     <p className="text-gray-600 text-sm line-clamp-2">{movie.description}</p>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <span className="text-gray-600">{movie.votes}</span>
//                                     <Button size="sm" className="bg-[#E53A0C] text-white rounded-full" onClick={() => handleVote(movie.id)}>
//                                         <ThumbsUp className="w-4 h-4" />
//                                     </Button>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     ))}
//                 </div>
//             </section>
//         </div>
//     );
// }
