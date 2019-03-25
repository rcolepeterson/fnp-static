/* eslint-disable */
import Articles from "microzine-3.2/api/Articles";

let _hostname = "www.w3schools.com";
let _isFIF = _hostname === "" || _hostname.indexOf("about:blank") > -1;
// let _displaySize = document
//   .querySelector("html")
//   .getAttribute("data-displaysize");
let _collections = [];
let _endCardPlacement = ["shoppable", "related", "promotion", "ctabutton"];
let _shoppableButtonLabel = "buy now";
let _shoppableSectionLabel = "featured products";
let _ctaButtonLabel = "Call To Action";
let _microzineMetadata = window.mzMetadata;
let _articles = [];
let _staticCollections = [];
let _mergeStaticArticles = [];
let _registeredUrls = {
  headerUrl: "",
  ctaUrl: "",
  ctaCardUrl: "",
  promoCardUrl: ""
};
let _rowsInGroups = [2];
let _groupOrder = [];
let _groupsLoadByCollection = false;
let _mergeLast = true;
let _cutLast = false;

if (_isFIF) {
  try {
    _hostname = window.top.location.hostname;
  } catch (ex) {
    /* noop */
  }
}

let platform = /(iphone|ipad|ipod)/i.test(navigator.userAgent)
  ? "iOS"
  : /android/i.test(navigator.userAgent)
  ? "Android"
  : /macintosh/i.test(navigator.userAgent)
  ? "MacOS"
  : /windows/i.test(navigator.userAgent)
  ? "Windows"
  : /linux/i.test(navigator.userAgent)
  ? "Linux"
  : "unknown";

// if (
//   window.ArticleCollections &&
//   typeof window.ArticleCollections.getCollections === "function"
// ) {
//   window.ArticleCollections.getCollections().forEach(collection => {
//     // currently collectionName doesn't seem to be used but it's the Name of the collection in the _mapping.yml folder
//     _collections.push({
//       collectionType: collection.type,
//       collectionName: collection.name,
//       title: collection.title
//     });
//   });
// }

/**
 * A static class of Microzine info and status utilities
 */
class MicrozineProperties {
  /**
   * Gets the running environment of the Microzine
   *
   * @returns {string}  - One of `development`, `prototype`, `staging`, or `production`
   */
  static get env() {
    return _hostname.indexOf("local.") === 0 ||
      /\.local$/i.test(_hostname) ||
      _hostname.indexOf("localhost") === 0
      ? "development"
      : /^[a-z]+-prototype\./i.test(_hostname) ||
        /^prototype\.microsites\./i.test(_hostname)
      ? "prototype"
      : /^[a-z]+-staging\./i.test(_hostname) ||
        /^staging\.microsites\./i.test(_hostname)
      ? "staging"
      : "production";
  }

  /**
   * Gets the platform the Microzine is running on
   *
   * @returns {string}  - One of `iOS`, `Android`, `MacOS`, `Windows`, or `Linux`
   */
  static get platform() {
    return platform;
  }

  /**
   * Gets if the Microzine is running in a mobile browser
   *
   * @returns {boolean} - `true` if we are running on mobile, otherwise `false`
   */
  static get isMobile() {
    return platform === "iOS" || platform === "Android";
  }

  /**
   * Gets the brand of this Microzine
   *
   * @returns {string}  - The brand short name
   */
  static get brand() {
    return window.ZBI_MZCONFIG.b;
  }

  /**
   * Get the brand name, this is what's used on article details pages.
   * Not using `get brand` since it's from the backend and wont display well.
   *
   * @returns {string} - brand name as we want it to appear, set in meta data on _mapping.yml
   */
  static get brandName() {
    return window.mzMetadata.brand_name;
  }

  /**
   * Gets the brand of this Microzine
   *
   * @returns {string}  - The brand short name
   */
  static get brandColor() {
    return window.window.mzMetadata.brand_color;
  }

  /**
   * Gets the touch icon for this Microzine
   *
   * @returns {string}  - path to touch icon
   */
  static get touchIcon() {
    return window.window.mzMetadata.touch_icon;
  }

  /**
   * Gets the title for this Microzine
   *
   * @returns {string}  - title of the microzine
   */
  static get documentTitle() {
    return window.window.mzMetadata.title;
  }

  /**
   * Gets the app ID of this Microzine
   *
   * @returns {string}  - The app ID (UUID)
   */
  static get appID() {
    return window.ZBI_MZCONFIG.a;
  }

  /**
   * Gets the app name of this Microzine
   *
   * @returns {string}  - The app short name
   */
  static get appName() {
    return window.ZBI_MZCONFIG.an;
  }

  /**
   * Gets the app version of this Microzine
   *
   * @returns {string}  - The app version short name
   */
  static get appVersion() {
    return window.ZBI_MZCONFIG.av;
  }

  /**
   * Gets the entry page of this Microzine
   *
   * @returns {string}  - The entry page
   */
  static get entryPage() {
    return window.ZBI_MZCONFIG.e;
  }

  /**
   * Gets the domain-relative base path for the Microzine
   *
   * @returns {string}  - The base path
   */
  static get basePath() {
    return "https://cdn-prototype.microsites.partnersite.mobi";
    //return window.mzMetadata.siteURL;
  }

  /**
   * Gets the asset path whether static or dynamic using the domain-relative base path for the Microzine
   *
   * @returns {string}  - The base path
   */
  static get assetPath() {
    // window.ZBI_MZCONFIG.assetPath
    return `${this.basePath}/fuelspetrol2019/fp2019/assets/20190222154501`; // use basePath as a backup if assetPath isn't available
  }

  /**
   * Gets the path for the Microzine external_content directory which holds legacy single article JSON.
   * Used to load legacy article JSON that are no longer part of the article JSON.
   *
   * @returns {string}  - The base path
   */
  static get externalContentPath() {
    return `/${window.ZBI_MZCONFIG.b}/${
      window.ZBI_MZCONFIG.av
    }/external_content`;
  }

  /**
   * Gets if this is an interstitial ad
   *
   * @returns {boolean} - `true` if we are running as an interstitial, otherwise `false`
   */
  static get isInterstitial() {
    return true;
    // return ['interstitial'].includes(window.ZBI_MZCONFIG.mode);
  }

  /**
   *  Set multiple group options
   *
   * @param {Obj} {rowsInGroups, groupsLoadByCollection, groupOrder, mergeLast}
   */

  static groupsOpts({
    rowsInGroups = _rowsInGroups,
    groupsLoadByCollection = _groupsLoadByCollection,
    groupOrder = _groupOrder,
    mergeLast = _mergeLast,
    cutLast = _cutLast
  }) {
    MicrozineProperties.rowsInGroups = rowsInGroups;
    MicrozineProperties.groupsLoadByCollection = groupsLoadByCollection;
    MicrozineProperties.groupOrder = groupOrder;
    MicrozineProperties.mergeLast = mergeLast;
    MicrozineProperties.cutLast = cutLast;
  }

  /**
   * If you're using collections, you might have a group at the end of the collection that has
   * only one item, set this to true and it will merge with the previous group (thus making 5 items in that group)
   *
   * @returns {Bool} - true or false
   */
  static get mergeLast() {
    return _mergeLast;
  }

  /**
   * If you're using collections, you might have a group at the end of the collection that has
   * only one item, set this to true and it will merge with the previous group (thus making 5 items in that group)
   *
   * @param {Bool} mergeLast - true or false
   */
  static set mergeLast(mergeLast) {
    _mergeLast = mergeLast;
  }

  /**
   * If you're using collections, you might have a group at the end of the collection that has
   * only one item, set this to true and it will cut it out of the microzine
   *
   * @returns {Bool} - true or false
   */
  static get cutLast() {
    return _cutLast;
  }

  /**
   * If you're using collections, you might have a group at the end of the collection that has
   * only one item, set this to true and it will cut it out of the microzine
   *
   * @param {Bool} cutLast - true or false
   */
  static set cutLast(cutLast) {
    _cutLast = cutLast;
  }

  /**
   *  Set how many rows are in the groups
   *
   * @param {Array} rowsInGroups set to true will turn grouping controllers off and on
   */
  static set rowsInGroups(rowsInGroups) {
    _rowsInGroups = rowsInGroups;
  }

  /**
   *  returns the amount of rows in groups
   *
   * @returns {Array} returns number of rows in groups
   */
  static get rowsInGroups() {
    return _rowsInGroups;
  }

  /**
   *  Set order for grouped categories
   *
   * @param {Array} groupOrder is organized left to right for what you want to show first in groups
   */
  static set groupOrder(groupOrder) {
    _groupOrder = groupOrder;
  }

  /**
   *  What is the current order for grouped categories
   *
   * @returns {Array} returns your array of categories
   */
  static get groupOrder() {
    return _groupOrder;
  }
  /**
   * check if we're loading one collection after another as the user scrolls
   * default is false and thus grabs everything
   *
   * @returns {boolean} - returns if we are loading sets of articles by their collection
   */
  static get groupsLoadByCollection() {
    return _groupsLoadByCollection;
  }
  /**
   * set true if we're loading one collection after another as the user scrolls
   * default is false and thus grabs everything
   *
   * @param {boolean} bool - true if we are loading sets of articles by their collection
   */
  static set groupsLoadByCollection(bool) {
    _groupsLoadByCollection = bool;
  }

  /**
   *  Gets the amount of columns to use in 3.0 on mobile based on mzMetadata set in the mapping file.
   *
   * @returns {number} returns a number
   */
  static get columns() {
    return window.window.mzMetadata.onecolumn ? 1 : 2;
  }

  /**
   * Gets if we are running in a Zbi SDK
   *
   * @returns {boolean} - `true` if we are running in the SDK, otherwise `false`
   */
  // static get isSDK() {
  //   return this.sdkVersion instanceof SemVer;
  // }

  /**
   * Gets the hostname of the Zbi metrics API
   *
   * @returns {string}  - API hostname
   */
  static get apiHost() {
    return `//${window.ZBI_MZCONFIG.ah}`;
  }

  /**
   * Gets the pixel hostname of the Zbi metrics API
   *
   * @returns {string}  - API hostname
   */
  static get pixelHost() {
    return `//${window.ZBI_MZCONFIG.ph}`;
  }

  /**
   * Gets if the Microzine is running in a friendly iframe
   *
   * @returns {boolean} - `true` if we are running in a friendly iframe, otherwise `false`
   */
  static get isFriendlyIframe() {
    return _isFIF;
  }

  /**
   * Gets the size (type) of the ad creative
   * @returns {string}  - Size of the creative; one of 'mrect' (for 300x250), 'skyscraper' (for 160x600), 'leaderboard' (for 728x90), or ''
   */
  static get displaySize() {
    return "cpeterson removed for gatsby build";
  }

  /**
   * Gets end card placement which constitutes the order and visibility of the endcards
   *
   * @returns {Array} - the end card placement
   */
  static get endCardPlacement() {
    return _endCardPlacement;
  }

  /**
   * Sets end card placement which constitutes the order and visibility of the endcards
   *
   * @param {Array} endCardPlacement - new end card placement
   */
  static set endCardPlacement(endCardPlacement) {
    _endCardPlacement = endCardPlacement;
  }

  /**
   * Gets the shoppable products button label for display
   *
   * @returns {string} - the shoppable button label
   */
  static get shoppableButtonLabel() {
    return _shoppableButtonLabel;
  }

  /**
   * Sets the shoppable products button label
   *
   * @param {string} label - new label for shoppable button
   */
  static set shoppableButtonLabel(label) {
    _shoppableButtonLabel = label;
  }

  /**
   * Gets the shoppable products section label for display
   *
   * @returns {string} - shoppable section label
   */
  static get shoppableSectionLabel() {
    return _shoppableSectionLabel;
  }

  /**
   *  Sets the shoppable products section label
   *
   * @param {string} label - new text for the shoppable section label
   */
  static set shoppableSectionLabel(label) {
    _shoppableSectionLabel = label;
  }

  /**
   * Gets the shoppable products section label for display
   *
   * @returns {string} - shoppable section label
   */
  static get ctaButtonLabel() {
    return _ctaButtonLabel;
  }

  /**
   *  Sets the shoppable products section label
   *
   * @param {string} label - new text for the shoppable section label
   */
  static set ctaButtonLabel(label) {
    _ctaButtonLabel = label;
  }

  /**
   *  Sets the shoppable products section label
   *
   * @param {obj} obj - the url you want to register prop:value
   */
  static set registeredUrls(obj) {
    _registeredUrls = Object.assign({}, _registeredUrls, obj);
  }

  /**
   *  Get registered Urls
   *
   * @param {obj} registered urls - object containing the registered urls.
   */
  static get registeredUrls() {
    return _registeredUrls;
  }

  /**
   * A generic dictionary to use for storing info
   *
   * @returns {Object}  - The metadata object
   */
  static get microzineMetadata() {
    return _microzineMetadata;
  }

  /**
   * A generic dictionary to use for storing info
   *
   * @param {Object} obj - The data you want to add/overwrite to the Microzine Metadata obj
   */
  static set microzineMetadata(obj) {
    _microzineMetadata = Object.assign({}, _microzineMetadata, obj);
  }

  /**
   * Get articles
   *
   */
  static get articles() {
    return _articles;
  }

  /**
   * Store articles
   *
   * @param {Array} articles - array of {articles}, The articles you want to store
   */
  static set articles(articles) {
    _articles = articles;

    window.articles = articles;

    _mergeStaticArticles = Articles.mergeStaticArticles({
      staticCollections: this.staticCollections,
      articles: this.articles
    });
  }

  /**
   * Get static articles
   *
   */
  static get staticCollections() {
    return _staticCollections;
  }

  /**
   * Store static articles
   *
   * @param {Array} articles - array of {articles}, The static articles you want to store
   */
  static set staticCollections(staticCollections) {
    _staticCollections = staticCollections;

    _mergeStaticArticles = Articles.mergeStaticArticles({
      staticCollections: this.staticCollections,
      articles: this.articles
    });
  }

  /**
   * Get articles with static articles mixed in
   *
   */
  static get articlesWithStatic() {
    if (!this.staticCollections.length) {
      return this.articles;
    }
    return _mergeStaticArticles;
  }

  /**
   * Gets the collection data for a specific collection for the MZ
   *
   * @param {string} collectionType - name of the collection to get data for
   * @returns {obj}  - collection data based on source.
   */
  static getCollectionData(collectionType = "blog") {
    return _collections.find(
      source => source.collectionType === collectionType
    );
  }

  /**
   * Gets all the collections for the MZ
   *
   * @returns {Array}  - array containing all the collections
   */
  static get collections() {
    return _collections;
  }
}

export default MicrozineProperties;
