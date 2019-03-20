import Ajax from 'microzine-3.2/helpers/Ajax';
import Article from 'microzine-3.2/models/Article';
import Logger from 'microzine-3.2/helpers/Logger';
import Properties from 'microzine-3.2/helpers/MicrozineProperties';
import Zipper from 'microzine-3.2/api/articleSortingStrategies/ZipperStrategy';

let _pageSize = 20,
  _articleCollections = [],
  _staticCollections = [],
  _articles = [],
  _pages = [],
  _sortingStrategy = Zipper,
  _sortingStrategyOptions = {},
  _collectionFilters = {},
  _loadedCollections = [],
  _failedArticleCollections = [],
  _failedStaticArticleCollections = [],
  _isLoading = false;

/** UTILITY methods for failed collection support. */

/**
 * Takes xhr.url and returns last two segments so we can match against the collection url.
 * /1/2/3/4 becomes /3/4
 *
 * @param {string} url
 * @returns {string} the last two url segments.
 */
const normalizeXHRURL = url =>
  url
    .split('/')
    .slice(-2)
    .join('/');

/**
 * Finds the failed collection by URL.
 *
 * @param {number} value  - Number of articles to get per call
 */
const findFailedArticleCollection = url => {
  let collection = window.ArticleCollections.getCollections().find(
    c => c.url === normalizeXHRURL(url)
  );
  return collection;
};

const findFailedStaticArticleCollection = url => {
  let collection = window.StaticCollections.getStaticCollections().find(
    c => c.url === normalizeXHRURL(url)
  );
  return collection;
};

/**
 * Adds colection to the failed Article collection array if not already present.
 * @param {*} failedObject
 */
const addToFailedArticleArray = failedCollection => {
  // check if already in array ...
  let inArray = _failedArticleCollections.filter(a => {
    return a.url === failedCollection.url;
  });
  //do not add a 2nd time.
  if (inArray.length === 0) {
    _failedArticleCollections.push(failedCollection);
  }
};

const addToFailedStaticArticleArray = failedCollection => {
  let inArray = _failedStaticArticleCollections.filter(a => {
    return a.url === failedCollection.url;
  });
  if (inArray.length === 0) {
    _failedStaticArticleCollections.push(failedCollection);
  }
};
/**** */

/**
 * Static class to query and sort articles
 * @version 1.0
 */
class Articles {
  /**
   * Gets the current number of articles per page (in an API call)
   *
   * @returns {number}  - Number of articles per page
   */
  static get pageSize() {
    return _pageSize;
  }

  /**
   * Sets the number of articles per page (in an API call)
   *
   * @param {number} value  - Number of articles to get per call
   */
  static set pageSize(value) {
    if (typeof value !== 'number') {
      return;
    }

    value = ~~value;

    if (value < 1) {
      value = 1;
    } else if (value > 999) {
      value = 999;
    }

    _pageSize = value;
  }

  /**
   * Gets the number of pages the API has returned
   *
   * @returns {number}  - Number of pages returned
   */
  static get pageIndex() {
    return _pages.length;
  }

  /**
   * Gets the number of articles the API has returned
   *
   * @returns {number} - Number of articles returned
   */
  static get totalArticles() {
    return _articles.length;
  }

  /**
   * Gets the current article sorting strategy
   *
   * @returns {Class} - The current sorting strategy
   */
  static get sortingStrategy() {
    return _sortingStrategy;
  }

  /**
   * Sets a new article sorting strategy
   *
   * @param {Class} value - The new sorting strategy to use
   */
  static set sortingStrategy(value) {
    _sortingStrategy = value;
  }

  /**
   * Gets the current article sorting strategy options
   *
   * @returns {Object} - The current sorting strategy options
   */
  static get sortingStrategyOptions() {
    return _sortingStrategyOptions;
  }

  /**
   * Sets new article sorting strategy options
   *
   * @param {Object} value - The new sorting strategy options to use
   */
  static set sortingStrategyOptions(value) {
    _sortingStrategyOptions = value;
  }

  static get failedCollections() {
    return _failedArticleCollections;
  }
  static get failedStaticCollections() {
    return _failedStaticArticleCollections;
  }
  /**
   * Gets the current article collection filters
   *
   * @returns {Object} - The current collection filters
   */
  static get collectionFilters() {
    return _collectionFilters;
  }

  /**
   * Sets new article collection filters
   *
   * @param {Object} value - The new collection filters to use
   */
  static set collectionFilters(value) {
    _collectionFilters = value;
  }

  /**
   * Merge articles with static articles
   *
   * @param {Array} {staticArticles} - array of static articles
   * @param {Array} {articles} - array of articles
   * @returns {Array} - merged array of staticArticles and articles
   */
  static mergeStaticArticles({ staticCollections, articles }) {
    // we stringify our staticCollections to deep clone rather than shallow clone
    let newStaticCollections = JSON.parse(JSON.stringify(staticCollections));
    // now that we've stringified our static collections we need to make our articles
    // get their previously set Article model (now stripped since stringifying)
    newStaticCollections.forEach(collection => {
      collection.articles = collection.articles.map(article => {
        return new Article(article);
      });
    });

    // if there's no staticArticles then just return articles or if there's no articles
    // then forget about it
    if (staticCollections.length === 0) {
      return articles;
    }
    if (articles.length === 0) {
      return [];
    }

    let articlesWithStatic = articles.map((article, i) => {
      // any collections that want to go in the same spot as this article?
      let staticCollectionsToPlace = newStaticCollections.filter(collection => {
        let placeStatic = false;
        // find out if the current position (i) is equal to where the static array wants to be
        for (
          let currentValue = collection.initPos;
          currentValue <= i;
          currentValue = currentValue + collection.frequency
        ) {
          // we have a match
          if (currentValue === i) {
            placeStatic = true;
          }
          // keep looping til currentValue is too big
        }
        return placeStatic;
      });

      // if there are collections that would work get the next static article
      let staticArticles = staticCollectionsToPlace.map(collection => {
        // make sure we have articles to pull from
        if (!collection.articles.length) {
          let freshStaticArticles = Properties.staticCollections.find(coll => {
            return coll.name === collection.name;
          }).articles;

          collection.articles = [].concat(freshStaticArticles);
        }
        let staticArticle = collection.articles.shift().clone();
        // make the article article_collection_name the same as the article you're "pairing"
        // it with so the collection stays together if loading by collection
        staticArticle.article_collection_name = article.article_collection_name;
        return staticArticle;
      });

      // put static articles in front of the article
      return [].concat(...staticArticles).concat(article);
    });

    // Our final product.
    return [].concat(...articlesWithStatic);
  }

  /**
   * Queries articles from JSON and sets up all article collections, sorting, and filtering
   *
   * @param {string} basePath         - Base path to the JSON files
   * @returns {Promise.<Array|Error>} - Promise that resolves to an {Array} of article and static collection {Array}s, or rejects with an {Error}
   */
  static getAllArticlesFromJson(basePath, timeout) {
    _staticCollections = [];
    _articles = [];
    return new Promise((resolve, reject) => {
      let listedArticleCollections = window.ArticleCollections
          ? window.ArticleCollections.getCollections()
          : [],
        requests = null,
        listedStaticArticleCollections = window.StaticCollections
          ? window.StaticCollections.getStaticCollections()
          : [],
        staticRequests = null;

      // If there are failed collections. Use them VS Article collections.
      if (_failedArticleCollections.length > 0) {
        listedArticleCollections = _failedArticleCollections;
        requests = null;
      }
      if (_failedStaticArticleCollections.length > 0) {
        listedStaticArticleCollections = _failedStaticArticleCollections;
        staticRequests = null;
      }
      // filter out any requests we have succesfully loaded b4.
      let filterdArticleCollections = listedArticleCollections.filter(c => {
        return !_loadedCollections.includes(c.name);
      });

      let filterdStaticArticleCollections = listedStaticArticleCollections.filter(
        c => {
          return !_loadedCollections.includes(c.name);
        }
      );
      requests = filterdArticleCollections.map(c => {
        return Ajax.get(`${basePath}/${c.url}`, {}, timeout).catch(e => {
          // eslint-disable-next-line no-console
          console.warn('Error loading', e.url);
          addToFailedArticleArray(findFailedArticleCollection(e.url));
        });
      });
      staticRequests = filterdStaticArticleCollections.map(c => {
        return Ajax.get(`${basePath}/${c.url}`, {}, timeout).catch(e => {
          // eslint-disable-next-line no-console
          console.warn('Error loading', e.url);
          addToFailedStaticArticleArray(
            findFailedStaticArticleCollection(e.url)
          );
        });
      });
      // reset collections.
      _failedArticleCollections = [];
      _failedStaticArticleCollections = [];
      _articleCollections = [];
      _staticCollections = [];

      let collectionsPromises = Promise.all(requests).then(collections => {
        return new Promise((resolve, reject) => {
          collections.forEach((collection, i) => {
            if (collection && collection.length) {
              let name = listedArticleCollections[i].name;
              _loadedCollections.push(name);
              if (Array.isArray(_collectionFilters[name])) {
                _collectionFilters[name].forEach(
                  f => (collection = f.filter.doFilter(collection, f.options))
                );
              }

              _articleCollections.push(
                collection.map(a => {
                  a.article_collection_title =
                    listedArticleCollections[i].title; // change title to display title
                  return new Article(a);
                })
              );
            }
          });

          _articles = new _sortingStrategy(_articleCollections).sort(
            _sortingStrategyOptions
          ); /* eslint new-cap:off */
          resolve();
        });
      });

      let staticCollectionsPromises = Promise.all(staticRequests).then(
        collections => {
          return new Promise((resolve, reject) => {
            collections.forEach((collection, i) => {
              if (collection && collection.length) {
                let name = listedStaticArticleCollections[i].name;
                _loadedCollections.push(name);
                if (Array.isArray(_collectionFilters[name])) {
                  _collectionFilters[name].forEach(
                    f => (collection = f.filter.doFilter(collection, f.options))
                  );
                }
                _staticCollections.push(
                  collection.map(a => {
                    a.article_collection_title =
                      listedArticleCollections[i].title; // change title to display title
                    return new Article(a);
                  })
                );
              }
            });
            resolve();
          });
        }
      );

      Promise.all([collectionsPromises, staticCollectionsPromises])
        .then(() => resolve([_articles, _staticCollections]))
        .catch(err => {
          Logger.error(err);
          reject(err);
        });
    });
  }

  static loadStaticCollections(basePath) {
    return new Promise((resolve, reject) => {
      let listedStaticArticleCollections = window.StaticCollections
          ? window.StaticCollections.getStaticCollections()
          : [],
        staticRequests = listedStaticArticleCollections.map(c => {
          return Ajax.get(`${basePath}/${c.url}`).catch(e => e);
        });

      let staticCollectionsPromises = Promise.all(staticRequests).then(
        collections => {
          return new Promise((resolve, reject) => {
            collections.forEach((collection, i) => {
              if (collection && collection.length) {
                let name = listedStaticArticleCollections[i].name;
                if (Array.isArray(_collectionFilters[name])) {
                  _collectionFilters[name].forEach(
                    f => (collection = f.filter.doFilter(collection, f.options))
                  );
                }
                _staticCollections.push(
                  collection.map(a => {
                    a.article_collection_title =
                      listedStaticArticleCollections[i].title; // change title to display title
                    return new Article(a);
                  })
                );
              }
            });

            resolve();
          });
        }
      );

      Promise.all([staticCollectionsPromises])
        .then(() => resolve([_staticCollections]))
        .catch(err => {
          Logger.error(err);
          reject(err);
        });
    });
  }

  /**
   * Loads a single article fromt eh external_content directory.
   * Used when needing to fetch a legacy article that is not longer included in the normal article JSON.
   *
   * @static
   * @param {string} filename title of the article you are loading
   * @returns {Promise.<Object|Error>} - Promise that resolves to an Article {Object}
   */
  static getSingleArticleFromExternalContent(filename) {
    return Ajax.get(`${Properties.externalContentPath}/${filename}.json`)
      .catch(e => e)
      .then(article => {
        return Promise.resolve(article);
      });
  }

  /**
   * Gets a single {Article} from the articles {Array}
   * If no article found ... check in the external content folder and return.
   *
   * @param {Array} route               - The route to the {Article} you want to get
   * @returns {Promise.<Article|Error>} - Promise that resolves to the found {Article}, or rejects with an {Error} if the route is invalid
   */
  static loadSingleArticle(route) {
    return new Promise((resolve, reject) => {
      while (route && route.length && route[0] === null) {
        route.shift();
      }

      if (!Array.isArray(route) || route.length < 2) {
        reject(new Error(`Invalid article path "${route.join('/')}"`));
      } else if (
        Array.isArray(route) &&
        route.length === 2 &&
        route[0] === Properties.brand &&
        route[1] === Properties.entryPage
      ) {
        // it's the hub--send back null because we don't want to do a round trip when we know there will be no matching article
        Logger.info('Articles#loadSingleArticle found the hub');
        resolve(null);
      } else {
        let routeClone = Array.from(route),
          title = routeClone.splice(-1)[0],
          article = _articles.find(ar => {
            return (
              ar.article_collection_path === routeClone.join('/') &&
              ar.article_clean_title === title
            );
          });

        if (article) {
          resolve(article);
        } else {
          // if no article returned check in the external content folder.
          Logger.warn(
            'Could not find article in article collection. Loading from external content'
          );
          // external_content/dog-bites-postman87654a.json
          Articles.getSingleArticleFromExternalContent(title)
            .then(a => {
              resolve(new Article(a));
            })
            .catch(() => {
              reject(
                new Error(`Could not find article at "${route.join('/')}"`)
              );
            });
        }
      }
    });
  }

  /**
   * If using groups, and Properties.groupOrder is set to the order you'll receive collections,
   * this will get the next collect in the order. If there are no more collections it will return an error.
   *
   * @param {string} snapshotRoot  - set to the siteURL, ex: '/zumobi/3-0/1518637341'
   * @returns {Promise.<ArticleCollection>} - Promise that resolves to the Article collection that's next
   */
  static loadNextVisibleCollection(snapshotRoot) {
    if (_isLoading) {
      return Promise.reject(
        new Error('Cannot load a new collection while another one is loading')
      );
    }
    let nextCollectionName = Properties.groupOrder.find(
        c => !_loadedCollections.includes(c)
      ),
      nextCollection = window.ArticleCollections.getCollections().find(
        c => c.title === nextCollectionName
      );

    if (!nextCollection) {
      return Promise.reject(new Error('Cannot find a new collection to load'));
    }

    let cachedArticles = _loadedCollections[nextCollectionName];
    if (cachedArticles) {
      _articles = _articles.concat(cachedArticles);
      Promise.resolve(cachedArticles);
    }

    _isLoading = true;

    return Ajax.get(`${snapshotRoot}/${nextCollection.url}`)
      .catch(e => e)
      .then(articles => {
        let loadedArticles = [];

        if (Array.isArray(articles) && articles.length) {
          let filters = _collectionFilters[nextCollection.name];
          if (Array.isArray(filters)) {
            filters.forEach(
              f => (articles = f.filter.doFilter(articles, f.options))
            );
          }

          loadedArticles = articles.map(a => {
            a.article_collection_title = nextCollection.title; // change title to display title
            return new Article(a);
          });
        }

        _loadedCollections[nextCollectionName] = loadedArticles;

        loadedArticles = new _sortingStrategy([loadedArticles]).sort(
          _sortingStrategyOptions
        );

        _articles = _articles.concat(loadedArticles);
        _loadedCollections.push(nextCollectionName);
        _isLoading = false;
        return Promise.resolve(loadedArticles);
      });
  }
}

export default Articles;
