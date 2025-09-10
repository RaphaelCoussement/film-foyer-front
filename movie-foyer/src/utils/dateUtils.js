// Retourne le prochain samedi à partir d'aujourd'hui
export function getNextSaturday() {
    const today = new Date();
    const day = today.getDay(); // 0 = dimanche, 6 = samedi
    const diff = (6 - day + 7) % 7 || 7; // jours jusqu'au samedi suivant
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + diff);
    return nextSaturday.toISOString().split("T")[0]; // format YYYY-MM-DD
}

// Vérifie si une date est un samedi
export function isSaturday(date) {
    const d = new Date(date);
    return d.getDay() === 6;
}
