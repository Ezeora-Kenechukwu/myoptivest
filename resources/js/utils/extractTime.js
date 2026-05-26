// export default function extractTime(date) {
//     // Create a new Date object if the input is a valid date string
//     const dateObj = typeof date === "string" ? new Date(date) : date;

//     // Ensure the input is a valid Date object
//     if (!(dateObj instanceof Date) || isNaN(dateObj)) {
//         throw new Error("Invalid date input");
//     }

//     // Extract hours, minutes, and seconds
//     let hours = dateObj.getHours();
//     const minutes = dateObj.getMinutes().toString().padStart(2, "0");
//     const seconds = dateObj.getSeconds().toString().padStart(2, "0");

//     // Determine AM/PM
//     const period = hours >= 12 ? "PM" : "AM";

//     // Convert to 12-hour format
//     hours = hours % 12 || 12; // Convert 0 to 12 for midnight

//     // Return the formatted time string
//     return `${hours}:${minutes}:${seconds} ${period}`;
// }
export default function extractTime(time) {
    // Ensure the input is a valid time string
    if (typeof time !== "string" || !/^\d{2}:\d{2}:\d{2}$/.test(time)) {
        throw new Error("Invalid time input");
    }

    // Split the time string into hours, minutes, and seconds
    const [hoursStr, minutes, seconds] = time.split(":");
    let hours = parseInt(hoursStr, 10);

    // Determine AM/PM
    const period = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight

    // Return the formatted time string
    return `${hours}:${minutes} ${period}`;
}

// Example usage
// console.log(extractTime("18:00:00")); // Outputs: "6:00 PM"
// console.log(extractTime("00:30:00")); // Outputs: "12:30 AM"
// console.log(extractTime("12:45:00")); // Outputs: "12:45 PM"
// console.log(extractTime("06:15:00")); // Outputs: "6:15 AM"

