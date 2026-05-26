import isToday from "./isToday"
import isYesterday from "./isYesterday"

export default function formatMessageDateLong(date) {
const now = new Date()
const inputDate = new Date(date)
if (isToday(inputDate)) {
return inputDate.toLocaleTimeString([], {
    hour:"2-digit",
    minute:"2-digit",
})
}else if(isYesterday(inputDate)){
    return(
        "Yesterday" +
        inputDate.toLocaleTimeString([], {
            hour:"2-digit",
            minute:"2-digit",
        })
    )
}else if(inputDate.getFullYear() == now.getFullYear) {
    inputDate.toLocaleTimeString([], {
        day:"2-digit",
        month:"short",
    })
}else {
    return inputDate.toLocaleDateString();
}
}
