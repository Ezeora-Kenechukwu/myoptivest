 const formatDate2 = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',  // e.g. Wednesday
      day: 'numeric',   // e.g. 25
      month: 'long',    // e.g. January
      year: 'numeric',  // e.g. 2022
    }).format(date);
  };
  export default formatDate2
