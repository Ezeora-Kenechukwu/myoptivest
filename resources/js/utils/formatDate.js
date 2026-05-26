export default function formatDate(dateString) {
    // Parse the date string
    const date = new Date(dateString);

    // Extract day, month, year, hours, and minutes
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Define month names
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Format the date
    const formattedDate = `${day} ${months[monthIndex]}, ${year} ${hours}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'pm' : 'am'}`;

    return formattedDate;
  }
