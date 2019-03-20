/**
 * Returns Error object to use on xhr.timeout errors.
 */
const createTimeOutError = url => {
  let error = new Error('Could not complete AJAX call due to timeout');
  error.url = url;
  return error;
};

/**
 * Static class to make AJAX calls over the network
 */
class Ajax {
  /**
   * Method that completes the AJAX call
   *
   * @param {string} method       - Method of the request
   * @param {string} url          - URL to send the request to
   * @param {Object=} data        - Data to send as part of the request
   * @param {number=} timeout     - Value to use for xhr.timeout
   * @returns {Promise.<*|Error>} - Resolves to the result of the AJAX request, or rejects with an {Error} if there is a problem during the request
   * @private
   */
  static _core(method, url, data = {}, timeout = 8000) {
    // console.log('url', url, 'timeout', timeout);
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();

      xhr.open(method, url);

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          if (xhr.status === 204) {
            resolve(); // no body for "204 No Content"
          } else {
            resolve(JSON.parse(xhr.response));
          }
        } else {
          let error = new Error(
            `Could not complete AJAX call: ${xhr.statusText} (${xhr.status})`
          );
          error.url = xhr.statusText;
          reject(error);
        }
      };
      xhr.onerror = () => {
        reject(
          new Error(
            `Could not complete AJAX call: ${xhr.statusText} (${xhr.status})`
          )
        );
      };

      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.addEventListener('timeout', () => reject(createTimeOutError(url)));
      xhr.timeout = timeout;
      xhr.send(JSON.stringify(data));
    });
  }

  /**
   * Transforms an object into a query string for GET requests
   *
   * @param {Object} data - Data to transform to a query string
   * @returns {string}    - Final query string
   * @private
   */
  static _objectToQueryString(data) {
    let props = Object.getOwnPropertyNames(data);
    return props
      .map(p => `${encodeURIComponent(p)}=${encodeURIComponent(data[p])}`)
      .join('&');
  }

  /**
   * Creates a new GET request
   *
   * @param {string} url          - URL to send the request to
   * @param {Object=} data        - Data to send as part of the request
   * @param {number=} timeout     - Value to use for xhr.timeout
   * @returns {Promise.<*|Error>} - Resolves to the result of the AJAX request, or rejects with an {Error} if there is a problem during the request
   */
  static get(url, data, timeout) {
    return this._core('GET', url, data, timeout);
  }

  /**
   * Creates a new POST request
   *
   * @param {string} url          - URL to send the request to
   * @param {Object=} data        - Data to send as part of the request
   * @returns {Promise.<*|Error>} - Resolves to the result of the AJAX request, or rejects with an {Error} if there is a problem during the request
   */
  static post(url, data) {
    return this._core('POST', url, data);
  }
}

export default Ajax;
