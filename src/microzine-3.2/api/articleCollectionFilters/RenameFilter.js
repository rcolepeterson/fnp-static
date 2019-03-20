import ArticleCollectionFilter from 'microzine-3.2/base/ArticleCollectionFilter';

/**
 * Filter that renames properties of an article
 *
 * @version 1.0
 */
class RenameFilter extends ArticleCollectionFilter {
  /**
   * Renames properties over the articles in the collection
   *
   * @param {Array<Object>} articles  - List of articles to filter
   * @param {Object} options          - Options to use in the filter
   * @returns {Array<Object>}         - Filtered list of articles
   */
  doFilter(articles, options) {
    options = options || {};

    let properties = options.properties || [];

    properties.forEach(prop => {
      prop.renames.forEach(r => {
        articles
          .filter(a => r.regex.test(a[prop.name]))
          .forEach(a => (a[prop.name] = r.value));
      });
    });

    return articles;
  }
}

export default RenameFilter;
