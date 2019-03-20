import Logger from 'microzine-3.2/helpers/Logger';
import Storage from 'microzine-3.2/api/Storage';

const _favorites = Storage.getItem('favorites') || [];

/**
 * Static class to get/set/query favorited articles
 */
class Favorites {
  /**
   * Gets the list of favorited articles
   *
   * @returns {Array} - Current list of favorites
   */
  static getFavorites() {
    return _favorites;
  }

  /**
   * Adds a new article to the favorites list
   *
   * @param {string} articleID  - ID of the new article to add
   * @returns {void}
   */
  static addFavorite(articleID) {
    if (_favorites.includes(articleID)) {
      Logger.info(`Duplicate record found: ${articleID}, skipping`);
    } else {
      _favorites.push(articleID);
      Storage.setItem('favorites', _favorites);
    }
  }

  /**
   * Removes an article from the favorites list
   *
   * @param {string} articleID  - ID of the article to remove
   * @returns {bool}            - `true` if the article was found and removed, otherwise `false`
   */
  static removeFavorite(articleID) {
    let index = _favorites.findIndex(aid => aid === articleID),
      isFound = index > -1;

    if (isFound) {
      _favorites.splice(index, 1);
      Storage.setItem('favorites', _favorites);
    } else {
      Logger.info(`Failed to remove article: ${articleID}`);
    }

    return isFound;
  }

  /**
   * Gets if an article is currently favorited
   *
   * @param {string} articleID  - ID of the article to look for
   * @returns {boolean}         - `true` if the article is a favorite, otherwise `false`
   */
  static isFav(articleID) {
    return _favorites.includes(articleID);
  }
}

export default Favorites;
