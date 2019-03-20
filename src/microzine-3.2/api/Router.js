/* eslint-disable */
import Articles from "microzine-3.2/api/Articles";
import EventifierStatic from "microzine-3.2/base/EventifierStatic";
import Logger from "microzine-3.2/helpers/Logger";
import MicrozineEvents from "microzine-3.2/helpers/MicrozineEvents";
import Utils from "microzine-3.2/helpers/MicrozineUtils";
import Properties from "microzine-3.2/helpers/MicrozineProperties";

let _routeHistory = [],
  _baseUrl = document.location.href.split("#")[0],
  _routeOptions = {},
  _canNavigate = true;

/**
 * Static module that handles routing
 */
class Router extends EventifierStatic {
  /**
   * Gets the current route
   *
   * @returns {{route: Array<string>, type: string, tags: Array<string>, referrer: Array<string>}} - Route object
   */
  static get currentRoute() {
    // stringify/parse object to clone it; now if you modify the version passed in the event it doesn't change the copy in routeHistory
    return _routeHistory.length
      ? JSON.parse(JSON.stringify(_routeHistory[_routeHistory.length - 1]))
      : {};
  }

  /**
   * Gets the previous route
   *
   * @returns {{route: Array<string>, type: string, tags: Array<string>, referrer: Array<string>}} - Route object
   */
  static get previousRoute() {
    // stringify/parse object to clone it; now if you modify the version passed in the event it doesn't change the copy in routeHistory
    return _routeHistory.length > 1
      ? JSON.parse(JSON.stringify(_routeHistory[_routeHistory.length - 2]))
      : {};
  }

  /**
   * Gets the base page URL
   *
   * @returns {string}  - Page origin and pathname
   */
  static get baseUrl() {
    return _baseUrl;
  }

  /**
   * Gets if the Microzine can navigate to another page
   *
   * @returns {boolean} - `true` if the Microzine can navigate, otherwise `false`
   */
  static get canNavigate() {
    return _canNavigate;
  }

  /**
   * Sets if the Microzine can navigate to another page
   *
   * @param {boolean} value - Whether or not the Microzine can navigate
   */
  static set canNavigate(value) {
    if (typeof value === "boolean") {
      _canNavigate = value;
    }
  }

  /**
   * Initializes the Router
   *
   * @returns {void}
   * @private
   */
  static _initialize() {
    let loadedHash = Utils.trim(document.location.hash, "#");
    let sth = loadedHash.match(/\/sth\/?(.*)/);
    window.addEventListener("hashchange", this._handleHashChange.bind(this));
    if (sth) {
      if (sth[1] && sth[1] === "cp") {
        loadedHash = `${Properties.brand}/${Properties.entryPage}/sth`;
      } else {
        loadedHash = "";
      }
    }
    // make sure the hub is always #1 in history
    let currentHash;
    if (Properties.isFriendlyIframe) {
      // if the user is in a friendly iframe we know they'll be visiting the homepage we set in the creative
      currentHash = `${Properties.brand}/${Properties.entryPage}`;
    } else {
      currentHash = Utils.trim(document.location.hash, "#");
    }
    if (currentHash === `${Properties.brand}/${Properties.entryPage}`) {
      let hubRoute = {
        route: [Properties.brand, Properties.entryPage],
        type: "hub",
        tags: [],
        referrer: []
      };

      _routeHistory.push(hubRoute);
      this.dispatchEvent("routechange", {
        oldRoute: null,
        newRoute: hubRoute,
        article: null,
        isReplaced: false,
        doFireMetrics: true,
        doShow: false,
        _sdkUri: this.baseUrl
      });
    } else {
      this.navigateToHub({ replace: true, show: false });
    }

    // then go to the deep link if there is one (and it isn't just the hub)
    if (loadedHash) {
      this.setRoute(loadedHash);
    }
  }

  /**
   * Prepares Microzine to navigate to another page if the URL hash (fragment) has changed
   *
   * @returns {void}
   * @private
   */
  static _handleHashChange() {
    this.canNavigate = false;

    let routeParams = Utils.trim(document.location.hash, "#").split("/"),
      oldRoute;

    if (
      _routeHistory.length &&
      (_routeOptions.replace === true || _routeOptions.replace === "true")
    ) {
      oldRoute = _routeHistory.pop();
    }

    this._displayRoute(routeParams, oldRoute);
  }

  /**
   * Loads all page data and kicks off navigation to the new page
   *
   * @param {Array<string>} routeParams - Next route
   * @param {Array<string>} oldRoute    - Previous route
   * @returns {void}
   * @private
   */
  static _displayRoute(routeParams, oldRoute) {
    let routeOptions = {
      replace: false,
      fireMetrics: true,
      show: true
    };
    Object.assign(routeOptions, _routeOptions);
    _routeOptions = {};

    // prepend the brand if it isn't the first route param
    if (routeParams.length && routeParams[0] !== Properties.brand) {
      routeParams.unshift(Properties.brand);
    }

    Articles.loadSingleArticle(routeParams)
      .then(article => {
        oldRoute =
          oldRoute ||
          (_routeHistory.length
            ? _routeHistory[_routeHistory.length - 1]
            : null);

        let newRoute = {
          route: article
            ? routeParams
            : [Properties.brand, Properties.entryPage],
          type: article ? "article" : "hub",
          tags: article ? article.article_tags : [],
          source: article ? article.article_extras.source : "",
          referrer: oldRoute ? oldRoute.route : []
        };

        // don't set a duplicate entry
        if (oldRoute && Utils.arraysEqual(oldRoute.route, newRoute.route)) {
          //turn back on navigation
          this.canNavigate = true;
          return;
        }
        _routeHistory.push(newRoute);
        // stringify/parse event param objects to clone them; now if you modify the version passed in the event it doesn't change the copy in routeHistory
        let event = {
          oldRoute: oldRoute,
          newRoute: newRoute,
          article: article,
          isReplaced:
            routeOptions.replace === true || routeOptions.replace === "true",
          doFireMetrics:
            routeOptions.fireMetrics === true ||
            routeOptions.fireMetrics === "true",
          doShow: routeOptions.show === true || routeOptions.show === "true",
          _sdkUri: article && Properties.isSDK ? article._sdkUri : this.baseUrl
        };
        this.dispatchEvent("routechange", event);
      })
      .catch(error => {
        this.canNavigate = true;
        Logger.error(error);
      });
  }

  /**
   * Tell the Microzine to load a new page
   *
   * @param {Array<string>|string} params - New route to load
   * @param {Object=} options             - Options to use when loading the new route
   * @returns {void}
   */
  static setRoute(params, options = {}) {
    if (!this.canNavigate) {
      return;
    }

    let routeParams = [],
      i = 0;

    if (typeof params === "string") {
      params = params.split("/");
    }

    if (!Array.isArray(params) || params.length < 1) {
      return;
    }

    while (i < params.length) {
      if (typeof params[i] === "string") {
        routeParams.push(params[i]);
        i++;
        continue;
      }

      break; // break if the param is simply a string
    }

    _routeOptions = options;

    if (!Properties.isFriendlyIframe) {
      if (options.replace === true || options.replace === "true") {
        document.location.replace(`#${params.join("/")}`);
      } else {
        document.location.hash = params.join("/");
      }
    } else {
      this._displayRoute(params);
    }
  }

  /**
   * Gets a route (array of string path segments) from a fragment (location hash)
   *
   * @param {string=} fragment  - Route to parse
   * @returns {Array<string>}   - Route as an array of segments
   */
  static parseRoute(fragment) {
    // try/catch, because Utils.trim() operates on strings. If a bool or number is passed instead of a string, it will throw.
    // Better to catch and return null than worry about all edge cases.
    try {
      fragment = Utils.trim(fragment || document.location.hash, "#");

      if (typeof fragment !== "string" || fragment.indexOf("//") > -1) {
        return null;
      }
      return fragment.split("/");
    } catch (ex) {
      return null;
    }
  }

  /**
   * Creates a fragment (location hash) from an array of path segments
   *
   * @param {Array<string>} params  - Path segments that define a route
   * @returns {string}              - Route as a fragment
   */
  static writeFragment(params) {
    if (!Array.isArray(params)) {
      return "";
    } else {
      return params.join("/");
    }
  }

  /**
   * Gets if a route is a hub or an article
   *
   * @param {Array<string>} route - Route to check
   * @returns {string}            - `'hub'` if the route points to a hub, `'article'` if it points to an article
   */
  static getPageType(route) {
    if ("route" in route) {
      route = route.route;
    }

    return (route || this.currentRoute.route).length < 3 ? "hub" : "article";
  }

  /**
   * Gets the hash (fragment) for an article
   *
   * @param {Object} article  - Article to create a hash for
   * @returns {string}        - Hash (fragment)
   */
  static getHashForArticle(article) {
    return `#${Properties.brand}/${article.article_collection_path
      .split("/")
      .splice(1)
      .join("/")}/${article.article_clean_title}`;
  }

  /**
   * Kicks off navigation to the Microzine hub
   *
   * @param {Object} options - Options to use when loading the hub
   * @returns {void}
   */
  static navigateToHub(options) {
    this.setRoute(`${Properties.brand}/${Properties.entryPage}`, options);
  }
}

// MicrozineEvents.addEventListener(
//   "microzineready",
//   Router._initialize.bind(Router)
// );

export default Router;
