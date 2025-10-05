export function formatDuration(minutes) {
    if (!minutes || minutes <= 0) return "Durée inconnue";

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
        return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes} min` : ""}`;
    } else {
        return `${remainingMinutes} min`;
    }
}
