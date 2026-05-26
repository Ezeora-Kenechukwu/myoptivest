export default function isToday(date) {
const today = new Date()
return (
    date.getDate() === today.getDate() &&
    date.getDate() === today.getDate() &&
    date.getFullYear() === today.getFullYear()
)
}
