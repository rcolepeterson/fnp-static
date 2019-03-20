import ArticleSortingStrategy from 'microzine-3.2/base/ArticleSortingStrategy';

/**
 * An article sorting strategy that randomizes all articles across multiple collections
 *
 * @version 1.0
 */
class RandomizeStrategy extends ArticleSortingStrategy {
  /**
   * Creates a new instance of the Randomize article sorting strategy
   *
   * @param {Array} collections - An {Array} of all {Article} collections to sort
   */
  constructor(collections) {
    super(collections);

    this._articles = [];
  }

  /**
   * Adds an article from the collection to the main articles array.
   *
   * @param {Object} article  - Article to add to the list of articles
   * @returns {void}
   * @private
   */
  _addArticle(article) {
    article = this._sdkParseAndAddProperties(article);

    this._articles.push(article);
  }

  /**
   * Performs a sort over all of the article collections.
   *
   * @returns {Array} - Array of all articles in sorted order
   */
  sort() {
    this._collections.forEach(collection => {
      collection.forEach(ar => this._addArticle(ar));
    });

    let random = [];

    while (this._articles.length) {
      let index = ~~(Math.random() * this._articles.length);
      random.push(this._articles.splice(index, 1)[0]);
    }

    this._articles = random;

    return this._articles;
  }
}

export default RandomizeStrategy;
