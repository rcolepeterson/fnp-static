import ArticleSortingStrategy from 'microzine-3.2/base/ArticleSortingStrategy';

/**
 * An article sorting strategy sorts all articles from all collections together in order by publish date
 *
 * @version 1.0
 */
class PublishOrderStrategy extends ArticleSortingStrategy {
  /**
   * Creates a new instance of the PublishOrder article sorting strategy
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
   * @param {Object} options  - Options has passed to the sort method
   * @returns {Array}         - Array of all articles in sorted order
   */
  sort(options) {
    this._collections.forEach(collection => {
      collection.forEach(ar => this._addArticle(ar));
    });

    if (options && options.orderBy === 'desc') {
      this._articles = this._articles.sort(
        (a, b) =>
          a.article_published_at < b.article_published_at
            ? 1
            : a.article_published_at > b.article_published_at
              ? -1
              : 0
      );
    } else {
      this._articles = this._articles.sort(
        (a, b) =>
          a.article_published_at > b.article_published_at
            ? 1
            : a.article_published_at < b.article_published_at
              ? -1
              : 0
      );
    }

    return this._articles;
  }
}

export default PublishOrderStrategy;
