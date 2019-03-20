/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @param {function} func a function
 * @param {number} wait time to wait
 * @param {boolean} immediate should it be called immediately
 * @returns {function} function to be invoked.
 */
export const debounce = (func, wait, immediate) => {
  let timeout;
  return (...args) => {
    let context = this;
    let later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
};
