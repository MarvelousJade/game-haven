module.exports = function(dateObj) {
  let year = dateObj.getFullYear();
  let month = (dateObj.getMonth() + 1).toString();
  let day = dateObj.getDate().toString();
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}
