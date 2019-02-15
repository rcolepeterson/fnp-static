/**
 * Returns a user facing message re: how long it has been since a current date.
 * @usage dateDiff(article_published_at); output examples like ... a year ago || 9 months ago || 1 year ago
 *
 * @param {function} date a function
 * @returns {string} User facing messge holding date diff value and msg.
 */
export const dateDiff = date => {
  date = date.split('-');
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();
  let yy = parseInt(date[0]);
  let mm = parseInt(date[1]);
  let dd = parseInt(date[2]);
  let years, months, days;
  let tag = 'ago';

  // months
  months = month - mm;
  if (day < dd) {
    months = months - 1;
  }
  // years
  years = year - yy;
  if (month * 100 + day < mm * 100 + dd) {
    years = years - 1;
    months = months + 12;
  }
  // days
  days = Math.floor(
    (today.getTime() - new Date(yy + years, mm + months - 1, dd).getTime()) /
      (24 * 60 * 60 * 1000)
  );

  let response = 'problem using dateDiff';
  if (years === 0 && months === 0) {
    response = days < 2 ? days + ' day ' + tag : days + ' days ' + tag;
  }

  if (years === 0 && months >= 0) {
    response = months + ' months ' + tag;
  }

  if (years > 0) {
    response = years + ' year ' + tag;
  }

  if (years === 1) {
    response = 'a year ' + tag;
  }

  return response;
};
