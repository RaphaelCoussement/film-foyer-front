// Retourne le prochain samedi à partir d'aujourd'hui
export function getNextSaturday() {
    const today = new Date();
    const day = today.getDay(); // 0 = dimanche, 6 = samedi

    let diff;
    if (day === 6) {
        // Samedi → on garde aujourd'hui
        diff = 0;
    } else if (day === 0) {
        // Dimanche → on va au samedi suivant
        diff = 6;
    } else {
        // Lundi à vendredi → samedi de la même semaine
        diff = 6 - day;
    }

    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + diff);

    return nextSaturday.toISOString().split("T")[0]; // format YYYY-MM-DD
}

// Vérifie si une date est un samedi
export function isSaturday(date) {
    const d = new Date(date);
    return d.getDay() === 6;
}

