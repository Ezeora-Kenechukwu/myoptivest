export default function formatDuration(durationInHours) {
    const hours = Number(durationInHours);
    if (isNaN(hours) || hours < 0) return 'Invalid duration';

    const hoursInDay = 24;
    const hoursInWeek = hoursInDay * 7;
    const hoursInMonth = hoursInDay * 30; // Approximate month as 30 days

    if (hours >= hoursInMonth) {
        const months = Math.round(hours / hoursInMonth);
        return `${months} month${months > 1 ? 's' : ''}`;
    } else if (hours >= hoursInWeek) {
        const weeks = Math.round(hours / hoursInWeek);
        return `${weeks} week${weeks > 1 ? 's' : ''}`;
    } else if (hours >= hoursInDay) {
        const days = Math.round(hours / hoursInDay);
        return `${days} day${days > 1 ? 's' : ''}`;
    } else {
        const hrs = Math.round(hours);
        return `${hrs} hour${hrs !== 1 ? 's' : ''}`;
    }
}
