/**
 * Base class for creating an article collection filter
 */
class ArticleCollectionFilter {
  /**
   * Gets if this is a filter
   *
   * @returns {boolean}  - Is always `true`
   */
  get isFilter() {
    return true;
  }

  /**
   * Gets the name of the filter; should be overridden in the child class
   *
   * @returns {string}  - Name of the filter
   */
  get name() {
    return typeof this;
  }

  /**
   * Applies the filter to the articles; must be overridden in the child class
   *
   * @returns {void}
   */
  doFilter() {
    throw Error(
      'Method `doFilter` of an `ArticleCollectionFilter` must be overridden in the child class.'
    );
  }
}

export default ArticleCollectionFilter;
