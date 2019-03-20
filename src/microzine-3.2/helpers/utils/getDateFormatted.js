const months = [
  'January',
  'Febuary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const abbrevMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
];

/**
 * Return the ordinal suffix for a number.
 *
 * @param {number} a - number you want to find the suffix for.
 * @returns {string} ["th","st","nd","rd"][
 */
const ordsfx = a => {
  return ['th', 'st', 'nd', 'rd'][
    ((a = ~~(a < 0 ? -a : a) % 100) > 10 && a < 14) || (a %= 10) > 3 ? 0 : a
  ];
};

/**
 * formats a javascript Date object into a 12h AM/PM time string
 */
const formattime = dateobj => {
  let hour = dateobj.getHours();
  let minute = dateobj.getMinutes();
  let amPM = hour > 11 ? 'pm' : 'am';
  if (hour > 12) {
    hour -= 12;
  } else if (hour === 0) {
    hour = '12';
  }
  if (minute < 10) {
    minute = '0' + minute;
  }
  return hour + ':' + minute + amPM;
};

/**
 * Return formated date
 * @usage - getDateFormatted(article_published_at) returns April 28th
 *
 * @param {str} strDate - date you want to format.
 * @param {str} format - 'MMMM Do'
 * @returns {string} formatted date
 */
export const getDateFormatted = (strDate, format) => {
  let now = new Date(strDate);
  let ordinalSuffix = ordsfx(now.getDate());
  let dateValue = 'did not understand the format: ' + format;
  let date = months[now.getMonth()] + ' ' + now.getDate() + ordinalSuffix;
  if (format === 'MMMM Do') {
    dateValue = date;
  } else if (format === 'MMMM Do, YYYY' || format === 'MMMM D, YYYY') {
    dateValue = date + ' ' + now.getFullYear();
  } else if (format === 'h:mma - D MMM YYYY') {
    dateValue = `${formattime(now)} ${now.getDate()} ${
      abbrevMonths[now.getMonth()]
    } ${now.getFullYear()}`;
  }
  return dateValue;
};
