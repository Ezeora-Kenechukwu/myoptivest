export default function formatNotificationType(type) {
    // Filter the notifications to find the ReservationApprovedNotification type
    const reservationNotification = type

    // If found, format the notification type
    if (type) {
      const formattedType = type
        .replace('App\\Notifications\\', '') // Remove the namespace part
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // Add space before uppercase letters
        .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter

      return formattedType;
    }

    return null; // Return null if no ReservationApprovedNotification is found
  }
