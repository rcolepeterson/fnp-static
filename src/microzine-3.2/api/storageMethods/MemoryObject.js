const _memoryObject = {};

/**
 * A storage method that uses an in-memory object to hold data
 */
class MemoryObject {
  /**
   * Gets name of the current storage method
   *
   * @returns {string}  - The name of the storage method; in this case, "memoryObject"
   */
  get name() {
    return 'memoryObject';
  }

  /**
   * Gets the value of an item from storage
   *
   * @param {string} key  - Key to look up
   * @returns {*|null}    - Value for that key, or null if no key was found
   */
  getItem(key) {
    return _memoryObject[key];
  }

  /**
   * Sets the value of an item in storage
   *
   * @param {string} key    - Key to set
   * @param {string} value  - Value to set for the key
   * @returns {void}
   */
  setItem(key, value) {
    _memoryObject[key] = value;
  }

  /**
   * Gets if the specified key has a value in storage
   *
   * @param {string} key  - Key to look up
   * @returns {boolean}   - `true` if the key exists, otherwise `false`
   */
  hasItem(key) {
    return key in _memoryObject;
  }

  /**
   * Removes the specified key (and associated value) from storage
   *
   * @param {static} key  - Key to remove
   * @returns {void}
   */
  removeItem(key) {
    delete _memoryObject[key];
  }

  /**
   * Gets all keys from storage that match the prefix
   *
   * @param {string} prefix - Prefix to look up
   * @returns {Array}       - Keys in storage that match the given prefix
   */
  findItems(prefix) {
    return Object.getOwnPropertyNames(_memoryObject).filter(key => {
      let matches = key.match(/^(\w+::\w+::)(\w+)$/);
      return matches && matches.length === 3 && matches[1] === prefix;
    });
  }
}

export default MemoryObject;
