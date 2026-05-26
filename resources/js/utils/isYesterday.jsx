export default function isYesterday(date) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return (
        date.getDate() === yesterday.getDate() &&
        date.getDate() === yesterday.getDate() &&
        date.getFullYear() === yesterday.getFullYear()
    )
}
