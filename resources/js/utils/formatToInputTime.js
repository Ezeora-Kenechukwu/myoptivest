// Function to format a date or time to "HH:MM" for time input
export default function formatToInputTime(dateOrTime) {
    const d = new Date(dateOrTime);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}
