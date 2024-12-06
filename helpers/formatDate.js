module.exports = function(dateObj) {
  if (!dateObj) {
    console.warn("formatDate helper received an undefined or null date.");
    return "N/A"; // Default value when date is missing
  }

  // Attempt to parse the date
  const parsedDate = new Date(dateObj);
  if (isNaN(parsedDate)) {
    console.warn(`formatDate helper received an invalid date: ${dateObj}`);
    return "Invalid Date"; // Default value for invalid dates
  }

  // Format the date as 'YYYY-MM-DD'
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(parsedDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
