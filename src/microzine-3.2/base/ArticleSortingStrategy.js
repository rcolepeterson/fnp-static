import Properties from 'microzine-3.2/helpers/MicrozineProperties';

/**
 * Base class for creating an article sorting strategy
 */
class ArticleSortingStrategy {
  /**
   * Creates a new instance of the sorting strategy
   *
   * @param {Array<Object>} collections - An {Array} of all article collections to sort
   */
  constructor(collections) {
    this._collections = collections;
  }

  /**
   * Gets if this is an article sorting strategy
   *
   * @returns {boolean} - Always `true`
   */
  get isStrategy() {
    return true;
  }

  /**
   * Gets the name of this article sorting strategy
   *
   * @returns {string}  - Name of the sorting strategy
   */
  get name() {
    return typeof this;
  }

  /**
   * For articles coming from the SDK, parse the content field and add additional SDK article properties
   *
   * @param {Object} article  - Article to parse
   * @returns {Object}        - Article with merged properties
   * @private
   */
  _sdkParseAndAddProperties(article) {
    if (Properties.isSDK && Properties.sdkVersion.gt('1.3.0')) {
      let mergedArticle = JSON.parse(article.content);
      Object.assign(mergedArticle, {
        _sdkUri: article.uri,
        _sdkIsConsumed: article.isConsumed,
        _sdkTags: article.tags
      });

      return mergedArticle;
    } else {
      return article;
    }
  }

  /**
   * Performs a sort over all of the article collections; must be overridden in the child class
   *
   * @returns {void}
   */
  sort() {
    throw Error(
      'Method `sort` of an `ArticleSortingStrategy` must be overridden in the child class.'
    );
  }
}

export default ArticleSortingStrategy;
