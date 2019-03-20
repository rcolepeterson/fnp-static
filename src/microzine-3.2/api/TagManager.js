import EventifierStatic from 'microzine-3.2/base/EventifierStatic';
// import Logger from 'microzine-3.2/helpers/Logger';
import Storage from 'microzine-3.2/api/Storage';
import Utils from 'microzine-3.2/helpers/MicrozineUtils';
// import Zbi from 'microzine-3.2/sdk/Zbi';

let _tags,
  _storageKey = '__tag-manager-all-tags__';

/**
 * Static class to work with content tags
 *
 * @version 1.0
 */
class TagManager extends EventifierStatic {
  /**
   * Gets a flat list of all tag names
   *
   * @returns {Array} - List of tag names
   */
  static get tagList() {
    return Object.getOwnPropertyNames(_tags);
  }

  /**
   * Gets a hash of all tags and the number of times they have been added
   *
   * @returns {Object}  - Hash of tag names and their count
   */
  static get weightedTags() {
    return _tags;
  }

  /**
   * Gets the user profile from the native SDK
   *
   * @returns {Promise.<Object>}  - Promise that resolves with the tags hash, or an empty has if there was an error
   * @private
   */
  static _getTagsFromSDK() {
    // return new Promise((resolve, reject) => {
    //   Zbi.getUserProfile()
    //     .then(resp => resolve(resp))
    //     .catch(err => {
    //       Logger.error(`Could not get user profile from SDK: ${err}`);
    //       resolve({});
    //     });
    // });
    return Promise.resolve();
  }

  /**
   * Decides which method to use to get saved tag info and loads them
   *
   * @returns {Promise} - Empty promise that resolves when tags have been loaded into memory
   * @private
   */
  static _loadProfileTags() {
    if (Storage.hasItem(_storageKey)) {
      // if we already have tags in storage, use those
      _tags = Storage.getItem(_storageKey);
      return Promise.resolve();
    } else if (Utils.isSDK) {
      // if not, then see if we can get them from the SDK
      return this._getTagsFromSDK().then(tags => (_tags = tags));
    } else {
      // otherwise, just init them as an empty tag object
      _tags = {};
      return Promise.resolve();
    }
  }

  /**
   * Initiailizes the TagManager
   * It is done explicitly because it must be initialized *after* any SDK determination has been done
   *
   * @returns {void}
   */
  static initialize() {
    this._loadProfileTags().then(() => {
      Storage.setItem(_storageKey, _tags);
      this.dispatchEvent('userprofileloaded');
    });
  }

  /**
   * Increments one or more tag names in the hash and updates the saved hash
   * Also fires the `tagschanged` event
   *
   * @param {Array<string>|string} tags - List of tag names to increment
   * @returns {void}
   */
  static incrementTags(tags) {
    // in case it is a single tag sent as a string instead of an array
    if (!Array.isArray(tags)) {
      tags = [tags.toString()];
    }

    let added = [];

    tags.forEach(tag => {
      if (typeof tag === 'string') {
        if (!_tags[tag]) {
          _tags[tag] = 0;
          added.push(tag);
        }

        _tags[tag]++;
      }
    });

    Storage.setItem(_storageKey, _tags);
    if (added.length) {
      this.dispatchEvent('tagschanged', { added: added, removed: [] });
    }
  }

  /**
   * Decrements one or more tag names in the hash and updates the saved hash
   * Also fires the `tagschanged` event
   *
   * @param {Array<string>|string} tags - List of tag names to decrement
   * @returns {void}
   */
  static decrementTags(tags) {
    // in case it is a single tag sent as a string instead of an array
    if (!Array.isArray(tags)) {
      tags = [tags.toString()];
    }

    let removed = [];

    tags.forEach(tag => {
      if (typeof tag === 'string') {
        if (_tags[tag]) {
          _tags[tag]--;

          if (_tags[tag] < 1) {
            delete _tags[tag];
            removed.push(tag);
          }
        }
      }
    });

    Storage.setItem(_storageKey, _tags);
    if (removed.length) {
      this.dispatchEvent('tagschanged', { added: [], removed: removed });
    }
  }

  /**
   * Clears all tags and updates the store to an empty hash
   * Also fires the `tagschanged` event
   *
   * @returns {void}
   */
  static clearTags() {
    let removed = this.tagList;

    _tags = {};

    Storage.setItem(_storageKey, _tags);
    if (removed.length) {
      this.dispatchEvent('tagschanged', { added: [], removed: removed });
    }
  }
}

export default TagManager;
