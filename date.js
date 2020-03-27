
exports.getDate = function() {
  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  };

  return day = today.toLocaleDateString("en-US", options);
}
