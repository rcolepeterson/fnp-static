import Logger from 'microzine-3.2/helpers/Logger';
import Properties from 'microzine-3.2/helpers/MicrozineProperties';
import SMLocalStorage from 'microzine-3.2/api/storageMethods/LocalStorage';
import SMMemoryObject from 'microzine-3.2/api/storageMethods/MemoryObject';

// let _storageMethod = window.localStorage
//     ? new SMLocalStorage()
//     : new SMMemoryObject(),
//   _storagePrefix = [
//     Properties.env === 'development' ? 'zbimtest' : 'zbim',
//     Properties.appName,
//     Properties.appVersion,
//     Properties.entryPage,
//     ''
//   ].join('::'),
//   _storedFunctions;
let _storageMethod;
try {
  _storageMethod = window.localStorage
    ? new SMLocalStorage()
    : new SMMemoryObject();
  //console.log('localStorage is available.');
} catch (err) {
  //console.log('localStorage is NOT available.');
  _storageMethod = new SMMemoryObject();
}

let _storagePrefix = [
    Properties.env === 'development' ? 'zbimtest' : 'zbim',
    Properties.appName,
    Properties.appVersion,
    Properties.entryPage,
    ''
  ].join('::'),
  _storedFunctions;

/**
 * Static class that gets and sets data in storage, many times to persist between visits
 */
class Storage {
  /**
   * Gets name of the current storage method, or "none" if no storage method exists
   *
   * @returns {string}  - Name of the storage method
   */
  static get storageMethodName() {
    return this._isStorageAvailable ? _storageMethod.name : 'none';
  }

  /**
   * Gets if there is a storage method available
   *
   * @returns {boolean} - `true` if storage is available, otherwise `false`
   * @private
   */
  static get _isStorageAvailable() {
    if (_storageMethod === null) {
      Logger.error('Storage error: no storage method is available');
      return false;
    }

    return true;
  }

  /**
   * Creates a storage key based on the unique prefix and the given friendly key
   *
   * @param {string} key  - Friendly key name
   * @returns {string}    - Unique compound key
   * @private
   */
  static _createKey(key) {
    return _storagePrefix + key;
  }

  /**
   * Gets the type of a value
   *
   * @param {*} val     - Value to check
   * @returns {string}  - Type of the value
   * @private
   */
  static _getValueType(val) {
    let type = typeof val;

    if (type === 'object') {
      type =
        val === null
          ? 'null'
          : val instanceof Array
            ? 'array'
            : val instanceof Object
              ? 'plainobject'
              : 'unknown';
    }

    return type;
  }

  /**
   * Gets the value of an item from storage
   *
   * @param {string} key  - Key to look up
   * @returns {*}         - Value for that key, or null if no key was found
   */
  static getItem(key) {
    if (!this._isStorageAvailable) {
      return;
    }

    let stored = _storageMethod.getItem(this._createKey(key)),
      matches,
      type,
      val;

    if (!stored) {
      // no value exists for the key
      return null;
    }

    matches = stored.match(/^(\w+)::(.+)$/);
    if (!matches || matches.length !== 3) {
      // can't parse the value, so...
      return null;
    }

    type = matches[1];
    val = matches[2];

    switch (type) {
      case 'function':
        val = _storedFunctions[val];
        break;
      case 'number':
        val = +val;
        break;
      case 'boolean':
        val = val === 'true';
        break;
      case 'array': // falls through
      case 'plainobject':
        val = JSON.parse(val);
        break;
      case 'null':
        val = null;
        break;
      case 'undefined':
        val = undefined;
        break;
      default:
        // string or unknown; return as string
        break;
    }

    return val;
  }

  /**
   * Sets the value of an item in storage
   *
   * @param {string} key  - Key to set
   * @param {*} val       - Value to set for the key
   * @returns {boolean}   - `true` if the key/value was set, otherwise `false`
   */
  static setItem(key, val = undefined) {
    if (!this._isStorageAvailable || typeof key !== 'string') {
      return false;
    }

    try {
      let type = this._getValueType(val),
        storageKey = this._createKey(key);

      if (type === 'unknown') {
        val = val.toString();
        Logger.warn(`Storage warning: value type is unknown; value will be converted to string "${val}"
and cannot be converted back to the original object (key: ${key}).`);
      }

      if (type === 'function') {
        // if it is a function, store it and save the key so we can get it later...
        _storedFunctions[key] = val;
        _storageMethod.setItem(storageKey, `${type}::${key}`);
      } else {
        // ...otherwise just save the value
        if (type === 'array' || type === 'plainobject') {
          val = JSON.stringify(val);
        }
        _storageMethod.setItem(storageKey, `${type}::${val}`);
      }

      return true;
    } catch (ex) {
      if (ex.name === 'FallbackRequiredError') {
        this.fallback();
      } else {
        Logger.error(`Storage error: ${ex}
in setItem(${key}, ${val})`);
      }

      return false;
    }
  }

  /**
   * Gets if the specified key has a value in storage
   *
   * @param {string} key  - Key to look up
   * @returns {boolean}   - `true` if the key exists, otherwise `false`
   */
  static hasItem(key) {
    return _storageMethod.hasItem(key);
  }

  /**
   * Removes the specified key (and associated value) from storage
   *
   * @param {string} key  - Key to remove
   * @returns {void}
   */
  static removeItem(key) {
    if (!this._isStorageAvailable) {
      return;
    }

    _storageMethod.removeItem(this._createKey(key));
  }

  /**
   * Gets the number of items in storage
   *
   * @returns {number}  - Number of items in storage
   */
  static countItems() {
    return _storageMethod.findItems(_storagePrefix).length;
  }

  /**
   * Removes all items from storage
   *
   * @returns {void}
   */
  static clearItems() {
    let items = _storageMethod.findItems(_storagePrefix);

    items.forEach(key => _storageMethod.removeItem(key));
  }

  /**
   * Falls back to in-memory storage if the previous storage method fails
   *
   * @returns {void}
   */
  static fallback() {
    if (!_storageMethod) {
      Logger.info('No Storage method set yet.');
      return;
    }

    if (_storageMethod instanceof SMMemoryObject) {
      Logger.error(
        'Storage is already using in-memory object. Cannot fall back.'
      );
      return;
    }

    Logger.info('Storage error. Falling back to in-memory object.');

    let oldStorageMethod = _storageMethod,
      items = oldStorageMethod.findItems(_storagePrefix);

    _storageMethod = new SMMemoryObject();

    items.forEach(key => {
      _storageMethod.setItem(key, oldStorageMethod.getItem(key));
      oldStorageMethod.removeItem(key);
    });
  }
}

export default Storage;
