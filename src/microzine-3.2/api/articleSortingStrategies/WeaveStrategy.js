import ArticleSortingStrategy from 'microzine-3.2/base/ArticleSortingStrategy';
import Zipper from 'microzine-3.2/api/articleSortingStrategies/ZipperStrategy';

/**
 * An article sorting strategy that weaves articles from multiple collections as directed
 *
 * @version 1.0
 */
class WeaveStrategy extends ArticleSortingStrategy {
  /**
   * Creates a new instance of the Weave article sorting strategy
   *
   * @param {Array} collections - An {Array} of all {Article} collections to sort
   */
  constructor(collections) {
    super(collections);

    this._collectionData = {};
    this._articles = [];
  }

  /**
   * Performs a sort over the article collections.
   *
   * @param {Object} options  - Options to use when sorting
   * @returns {Array}         - Array of all articles in sorted order
   */
  sort(options) {
    // if we don't have a set order, no sense in doing this; that's just a zipper
    if (
      !options ||
      !Array.isArray(options.collectionOrder) ||
      !options.collectionOrder.length
    ) {
      let zipper = new Zipper(this._collections);
      this.articles = zipper.sort();
      return this.articles;
    }

    /**
     * Finds if another article is available in any collection
     *
     * @returns {boolean}  - `true` if we have another article to add, otherwise `false`
     */
    function isAnotherArticleAvailable() {
      return options.collectionOrder.some(
        n => this._collectionData[n].state === 'available'
      );
    }

    options.collectionRecycle = options.collectionRecycle || [];

    this._collections.forEach(articles => {
      if (!articles.length) {
        return;
      }

      let name = articles[0].article_collection_name;
      if (!this._collectionData[name]) {
        this._collectionData[name] = {
          articles: articles,
          length: articles.length,
          index: 0,
          recycle: options.collectionRecycle.includes(name),
          state: 'available'
        };
      }
    });

    let collectionIndex = -1,
      maxCollectionIndex = options.maxRepeat
        ? options.maxRepeat * options.collectionOrder.length
        : 99999;

    let getNextArticle = () => {
      collectionIndex++;

      let name =
          options.collectionOrder[
            collectionIndex % options.collectionOrder.length
          ],
        data = this._collectionData[name];

      if (data.state === 'unavailable') {
        return null;
      }

      let article = data.articles[data.index % data.length];
      data.index++;
      if (data.index >= data.length) {
        data.state = data.recycle ? 'recycle' : 'unavailable';
      }

      return article;
    };

    while (
      collectionIndex < maxCollectionIndex - 1 &&
      isAnotherArticleAvailable.call(this)
    ) {
      let article = getNextArticle();
      if (article) {
        article = this._sdkParseAndAddProperties(article);
        this._articles.push(article);
      }
    }
    return this._articles;
  }
}

export default WeaveStrategy;
