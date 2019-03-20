import ArticleCollectionFilter from 'microzine-3.2/base/ArticleCollectionFilter';

/**
 * Filter that sorts the articles in the collection
 *
 * @version 1.0
 */
class ReorderFilter extends ArticleCollectionFilter {
  /**
   * Performs a sort over the articles in the collection
   *
   * @param {Array<Object>} articles  - List of articles to filter
   * @param {Object} options          - Options to use in the filter
   * @returns {Array<Object>}         - Filtered list of articles
   */
  doFilter(articles, options) {
    options = options || {};

    let command = options.command || 'orderby',
      commandOptions = {
        property: options.property || 'article_published_at',
        sortFunc: options.sortFunc || ((a, b) => (a > b ? 1 : a < b ? -1 : 0)),
        orderBy: options.orderBy || 'asc',
        fillRemainder: options.fillRemainder
      };

    Object.assign(commandOptions, options.commandOptions);

    switch (command) {
      case 'orderby':
        articles.sort((a, b) =>
          commandOptions.sortFunc.call(
            null,
            a[commandOptions.property],
            b[commandOptions.property]
          )
        );
        if (commandOptions.orderBy === 'desc') {
          articles.reverse();
        }
        break;
      case 'specify': {
        if (
          !(
            Array.isArray(commandOptions.specifyOrder) &&
            commandOptions.specifyOrder.length
          )
        ) {
          throw new Error(
            'The `specify` command must include the `specifyOrder` array as a `commandOption`'
          );
        }

        let newArticles = [];

        articles = JSON.parse(JSON.stringify(articles));
        commandOptions.specifyOrder.forEach(opt => {
          let i;
          while (
            ((i = articles.findIndex(a => opt.regex.test(a[opt.property]))),
            i > -1)
          ) {
            let foundArticle = articles.splice(i, 1)[0];
            newArticles.push(foundArticle);
          }
        });

        if (commandOptions.fillRemainder) {
          articles.forEach(a => newArticles.push(a));
        }

        articles = newArticles;
        break;
      }
    }

    return articles;
  }
}

export default ReorderFilter;
