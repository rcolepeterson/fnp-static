/**
 * A static class of generic string, number, and generation utilities
 */
class MicrozineUtils {
  /**
   * Returns an object no matter what, either it finds the object or returns 'undefined'
   * found it here: https://silvantroxler.ch/2017/avoid-cannot-read-property-of-undefined/
   *
   * @param {requestCallback} fn - Long object in  that you're not sure exists
   * @returns {Object}           - either 'undefined' or the object that was found
   */
  static getSafe(fn) {
    try {
      return fn();
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Trim one or more characters off the beginning and end of a given string
   *
   * @param {string} str          - String you want to trim
   * @param {Array<string>} chars - An array of strings, or multiple strings as arguments, to remove from the base string; defaults to a space
   * @returns {string}            - The trimmed string
   */
  static trim(str, ...chars) {
    chars =
      chars.length === 0 ? [' '] : Array.isArray(chars[0]) ? chars[0] : chars;

    let charMap = chars
        .map(c => {
          return typeof c === 'string' && c.length === 1 ? c : '';
        })
        .join(''),
      regExp1 = new RegExp(`^[${charMap}]+`),
      regExp2 = new RegExp(`[${charMap}]+$`);

    return str.replace(regExp1, '').replace(regExp2, '');
  }

  /**
   * Creates a new UUIDv4 (from http://jsperf.com/uuid-generator-opt/8)
   *
   * @returns {string}  - New UUID
   */
  static createUUID() {
    let lut = [],
      d0 = (Math.random() * 0x100000000) | 0,
      d1 = (Math.random() * 0x100000000) | 0,
      d2 = (Math.random() * 0x100000000) | 0,
      d3 = (Math.random() * 0x100000000) | 0;

    for (let i = 0; i < 256; i++) {
      lut[i] = (i < 16 ? '0' : '') + i.toString(16);
    }

    return (
      lut[d0 & 0xff] +
      lut[(d0 >> 8) & 0xff] +
      lut[(d0 >> 16) & 0xff] +
      lut[(d0 >> 24) & 0xff] +
      '-' +
      lut[d1 & 0xff] +
      lut[(d1 >> 8) & 0xff] +
      '-' +
      lut[((d1 >> 16) & 0x0f) | 0x40] +
      lut[(d1 >> 24) & 0xff] +
      '-' +
      lut[(d2 & 0x3f) | 0x80] +
      lut[(d2 >> 8) & 0xff] +
      '-' +
      lut[(d2 >> 16) & 0xff] +
      lut[(d2 >> 24) & 0xff] +
      lut[d3 & 0xff] +
      lut[(d3 >> 8) & 0xff] +
      lut[(d3 >> 16) & 0xff] +
      lut[(d3 >> 24) & 0xff]
    );
  }

  /**
   * Converts (and floors) milliseconds to seconds
   *
   * @param {number} millis - Number of milliseconds to convert
   * @returns {number}      - Number of seconds (as an integer)
   */
  static m2s(millis) {
    return ~~(millis / 1000);
  }

  /**
   * Does a shallow compare to see if two arrays are identical
   *
   * @param {Array} ar1 - First array to check
   * @param {Array} ar2 - Second array to check
   * @returns {boolean} - `true` if both arrays are identical, otherwise `false`
   */
  static arraysEqual(ar1, ar2) {
    // try the simple checks first
    if (Array.isArray(ar1) && Array.isArray(ar2) && ar1.length === ar2.length) {
      for (let i = 0; i < ar1.length; i++) {
        if (ar1[i] !== ar2[i]) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  /**
   * Sets cross platform 3d transform on elements.
   *
   * @param {HTMLElement} elem - the elem to set the transform on.
   * @param {number} x - the x coordinate for the transform.
   * @param {number} y - the x coordinate for the transform.
   * @param {number} z - the x coordinate for the transform.
   * @returns {void}
   */
  static set3dTransform(elem, x, y, z) {
    window.requestAnimationFrame(() => {
      elem.style.webkitTransform = elem.style.transform = `translate3d(${x}px,${y}px,${z}px)`;
    });
  }

  /**
   * Gets the dimensions that an image should be based on the container width
   *
   * @param {string} dimensions                                       - Dimensions string in the format "600x200" (600px wide, 200px high)
   * @param {number=} colWidth                                        - Width of the containing element
   * @returns {{width: number, height: number, scaledHeight: number}} - Necessary dimensions needed to show image
   */
  static getDimensions(dimensions, colWidth = document.body.clientWidth) {
    try {
      let dims = dimensions.match(/(\d+)x(\d+)/);

      let dimsW = parseInt(dims[1]),
        dimsH = parseInt(dims[2]),
        scale = colWidth / dimsW;
      return {
        width: dimsW,
        height: dimsH,
        scaledHeight: ~~dimsH * scale || 0
      };
    } catch (ex) {
      return { width: null, height: null, scaledHeight: null };
    }
  }
  /**
   * we do have a polyfill so this should just work in all supported browsers,
   * but I'm abstracting it out here just in case
   * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
   *
   * @param {element} elem - element you start with
   * @param {any} selector - target you're trying to find that's the closest ancestor of the elem
   * @returns {element|null} - the closest ancestor of the selected element, or null if it can't find it.
   */
  static closest(elem, selector) {
    return elem.closest(selector);
  }
}

export default MicrozineUtils;
