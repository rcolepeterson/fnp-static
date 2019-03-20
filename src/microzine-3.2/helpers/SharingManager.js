import Eventifier from 'microzine-3.2/base/EventifierStatic';
import Logger from 'microzine-3.2/helpers/Logger';
import MicrozineEvents from 'microzine-3.2/helpers/MicrozineEvents';
import Router from 'microzine-3.2/api/Router';
import Properties from 'microzine-3.2/helpers/MicrozineProperties';

let _hrefs = {},
  _elements = [];

/**
 * Static module that sets up the sharing buttons while using the Microzine
 */
class SharingManager extends Eventifier {
  /**
   * Gets the sharing services we support and metadata for use in sharing
   *
   * @returns {Object} - Hash of sharing service metadata
   * @private
   */
  static get _services() {
    return {
      facebook: {
        sharingFunction: this._createFacebookHref.bind(this)
      },
      twitter: {
        sharingFunction: this._createTwitterHref.bind(this)
      },
      pinterest: {
        sharingFunction: this._createPinterestHref.bind(this)
      },
      mailto: {
        sharingFunction: this._createMailtoHref.bind(this)
      }
    };
  }

  /**
   * Initializes the SharingManager
   *
   * @returns {void}
   * @private
   */
  static _initialize() {
    this._findSocial();
    //if there is no routechange initialize share hrefs
    let queryParams = location.search;
    _hrefs.baseHref = Properties.isFriendlyIframe
      ? `${document.getElementsByTagName('base')[0].href}${Properties.brand}/${
          Properties.entryPage
        }.html${queryParams}`
      : `${document.location.href}${queryParams}`;
    _elements.forEach(elem => {
      let service = elem.getAttribute('data-sharing-api'),
        href = this._services[service].sharingFunction.call(this, null);

      _hrefs[service] = href;
      elem.setAttribute(
        elem.nodeName.toLowerCase() === 'a' ? 'href' : 'data-href',
        href
      );
    });
  }

  /**
   * Finds the social buttons and links in the Microzine
   *
   * @returns {void}
   * @private
   */
  static _findSocial() {
    let sharingElems = document.querySelectorAll(
      'a[data-sharing-api], button[data-sharing-api]'
    );

    sharingElems.forEach(elem => {
      //let service = elem.getAttribute('data-sharing-api');

      _elements.push(elem);
      elem.addEventListener('click', this._handleSocialClick.bind(this));

      //Logger.log(`Found social button for ${service}`);
    });
  }

  /**
   * Adds the proper sharing URLs to the buttons when the route changes
   *
   * @param {EventArgs} e - Route change event args
   * @returns {void}
   * @private
   */
  static _handleRouteChange(e) {
    let article = e.article;

    if (article) {
      let scheme = location.href.startsWith('https:') ? 'https:' : 'http:';
      let queryParams = location.search;
      _hrefs.baseHref = `${scheme}${Properties.apiHost}/v2/share/${
        Properties.appVersion
      }/${article.article_collection_path}/${
        article.article_clean_title
      }${queryParams}`;
      _elements.forEach(elem => {
        let service = elem.getAttribute('data-sharing-api'),
          href = this._services[service].sharingFunction.call(this, article);

        _hrefs[service] = href;
        elem.setAttribute(
          elem.nodeName.toLowerCase() === 'a' ? 'href' : 'data-href',
          href
        );
      });
    } else {
      let queryParams = location.search;
      _hrefs.baseHref = `${document.location.href}${queryParams}`;
      _elements.forEach(elem => {
        let service = elem.getAttribute('data-sharing-api'),
          href = this._services[service].sharingFunction.call(this, article);

        _hrefs[service] = href;
        elem.setAttribute(
          elem.nodeName.toLowerCase() === 'a' ? 'href' : 'data-href',
          href
        );
      });
    }
  }

  /**
   * Gets the Facebook sharing URL for the current route
   *
   * @returns {string} - Sharing URL
   * @private
   */
  static _createFacebookHref() {
    return `https://www.facebook.com/sharer.php?u=${encodeURIComponent(
      _hrefs.baseHref
    )}`;
  }

  /**
   * Gets the Twitter sharing URL for the current route
   *
   * @param {Object} article  - Article at the current route
   * @returns {string}        - Sharing URL
   * @private
   */
  static _createTwitterHref(article) {
    let title = this._getTitle(article);

    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(_hrefs.baseHref)}`;
  }

  /**
   * Gets the Pintrest sharing URL for the current route
   *
   * @param {Object} article  - Article at the current route
   * @returns {string}        - Sharing URL
   * @private
   */
  static _createPinterestHref(article) {
    let title = this._getTitle(article);

    return `http://pinterest.com/pin/create/button/?url=${encodeURIComponent(
      _hrefs.baseHref
    )}&description=${encodeURIComponent(title)}&media=${encodeURIComponent(
      article.article_image_url
    )}`;
  }

  /**
   * Gets the email sharing URL for the current route
   *
   * @param {Object} article  - Article at the current route
   * @returns {string}        - Sharing URL
   * @private
   */
  static _createMailtoHref(article) {
    let subject = this._getTitle(article),
      text = 'Check this out!';

    return `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(text)}%0D%0A%0D%0A${encodeURIComponent(
      _hrefs.baseHref
    )}`;
  }

  /**
   * Gets the proper title to send to the sharing service
   *
   * @param {Object} article  - Article at the current route
   * @returns {string}        - Title to use for sharing
   * @private
   */
  static _getTitle(article) {
    return !article
      ? 'Check this out:'
      : article.article_collection_name === 'twitter'
        ? `Tweet from ${article.article_author}`
        : article.article_collection_name === 'instagram'
          ? `Instagram photo from ${article.article_author}`
          : article.article_title;
  }

  /**
   * Fires the `shareclicked` event when a sharing button is clicked
   *
   * @param {EventArgs} e - MouseClick event args
   * @returns {void}
   * @private
   */
  static _handleSocialClick(e) {
    let elem = e.target,
      service = elem.getAttribute('data-sharing-api');

    this.dispatchEvent('shareclicked', {
      service: service,
      baseHref: _hrefs.baseHref,
      href: _hrefs[service]
    });
  }
}

MicrozineEvents.addEventListener(
  'microzineready',
  SharingManager._initialize.bind(SharingManager)
);
Router.addEventListener(
  'routechange',
  SharingManager._handleRouteChange.bind(SharingManager)
);

export default SharingManager;
