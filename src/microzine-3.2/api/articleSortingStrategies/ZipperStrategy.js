import ArticleSortingStrategy from 'microzine-3.2/base/ArticleSortingStrategy';

/**
 * An article sorting strategy that simply weaves articles in order from multiple collections
 * For example: 1A, 1B, 1C, 2A, 2B, 2C... *
 *
 * @version 1.0
 */
class ZipperStrategy extends ArticleSortingStrategy {
  /**
   * Creates a new instance of the Zipper article sorting strategy
   *
   * @param {Array} collections - An {Array} of all {Article} collections to sort
   */
  constructor(collections) {
    super(collections);

    this._articles = [];
    this._index = 0;
    this._isMore = true;
  }

  /**
   * Adds an article from the collection to the main articles array
   *
   * @param {Array} collection  - Collection to extract the indexed {Article} from
   * @returns {void}
   * @private
   */
  _addArticle(collection) {
    if (collection.length > this._index) {
      let article = collection[this._index];

      article = this._sdkParseAndAddProperties(article);

      this._articles.push(article);
      this._isMore = true;
    }
  }

  /**
   * Performs a sort over all of the article collections
   *
   * @returns {Array} - Array of all articles in sorted order
   */
  sort() {
    this._index = 0;
    this._isMore = true;

    while (this._isMore) {
      this._isMore = false;
      this._collections.forEach(this._addArticle.bind(this));
      this._index++;
    }

    return this._articles;
  }
}

export default ZipperStrategy;
