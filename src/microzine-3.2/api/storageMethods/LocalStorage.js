import Logger from 'microzine-3.2/helpers/Logger';

/**
 * A storage method that uses the browser's local storage to hold data
 */
class LocalStorage {
  /**
   * Gets name of the current storage method
   *
   * @returns {string}  - The name of the storage method; in this case, "localStorage"
   */
  get name() {
    return 'localStorage';
  }

  /**
   * Gets the value of an item from storage
   *
   * @param {string} key  - Key to look up
   * @returns {*|null}    - Value for that key, or null if no key was found
   */
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (ex) {
      return null;
    }
  }

  /**
   * Sets the value of an item in storage
   *
   * @param {string} key    - Key to set
   * @param {string} value  - Value to set for the key
   * @returns {void}
   */
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (ex) {
      Logger.error(`Storage error: ${ex}`);
      throw new Error({
        name: 'FallbackRequiredError',
        message: `Storage error: ${ex}`
      });
    }
  }

  /**
   * Gets if the specified key has a value in storage
   *
   * @param {string} key  - Key to look up
   * @returns {boolean}   - `true` if the key exists, otherwise `false`
   */
  hasItem(key) {
    return typeof localStorage[key] !== 'undefined';
  }

  /**
   * Removes the specified key (and associated value) from storage
   *
   * @param {static} key  - Key to remove
   * @returns {void}
   */
  removeItem(key) {
    localStorage.removeItem(key);
  }

  /**
   * Gets all keys from storage that match the prefix
   *
   * @param {string} prefix - Prefix to look up
   * @returns {Array}       - Keys in storage that match the given prefix
   */
  findItems(prefix) {
    let items = [];

    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i),
        matches = key.match(/^(\w+::\w+::)(\w+)$/);
      if (matches && matches.length === 3 && matches[1] === prefix) {
        items.push(key);
      }
    }

    return items;
  }
}

export default LocalStorage;
