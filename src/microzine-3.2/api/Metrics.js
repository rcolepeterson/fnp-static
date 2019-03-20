import EventifierStatic from 'microzine-3.2/base/EventifierStatic';
//import FrameMessaging from 'microzine-3.2/helpers/FrameMessaging';
import Logger from 'microzine-3.2/helpers/Logger';
import MetricsValidator from 'microzine-3.2/helpers/MetricsValidator';
import MicrozineEvents from 'microzine-3.2/helpers/MicrozineEvents';
import Utils from 'microzine-3.2/helpers/MicrozineUtils';
import Router from 'microzine-3.2/api/Router';
import SharingManager from 'microzine-3.2/helpers/SharingManager';
import Storage from 'microzine-3.2/api/Storage';
import Properties from 'microzine-3.2/helpers/MicrozineProperties';
import VideoMetrics from 'microzine-3.2/api/Video';

const _ENDPOINTS = {
  impression: 'imp',
  load: 'l',
  firstInteraction: 'fi',
  userSession: 'us',
  content: 'c',
  interaction: 'i'
};
const _CONTENT_EVENTS = {
  pageStarted: 'ps',
  pageConsumed: 'pc',
  videoStarted: 'vs',
  videoConsumed: 'vc',
  videoQuartile: 'vq'
};
const _INTERACTION_EVENTS = {
  linkClicked: 'lc',
  buttonClicked: 'bc',
  relatedItemClicked: 'ri',
  shoppableItemClicked: 'si',
  shareButtonClicked: 'sh',
  pageSwiped: 'sw',
  virtualPageViewed: 'vp'
};
const _CREATIVE_DATA_MAPPING = new Map([
  ['crid', 'creative_id'],
  ['fmt', 'ad_format'],
  ['vnd', 'supply_vendor'],
  ['ptnid', 'partner_id'],
  ['advid', 'advertiser_id'],
  ['grpid', 'ad_group_id'],
  ['camid', 'campaign_id'],
  ['site', 'site'],
  ['dvc', 'device_type'],
  ['dvcid', 'device_id'],
  ['cntry', 'country'],
  ['city', 'city'],
  ['met', 'metro'],
  ['reg', 'region'],
  ['zip', 'zip_code'],
  ['lat', 'lat'],
  ['long', 'long'],
  ['impid', 'impression_id'],
  ['catid', 'category_id'],
  ['dealid', 'deal_id']
]);

let _isUnloaded = false,
  _hiddenProp = '',
  _scrollMetricsDetails = { ticking: false, startY: undefined },
  _virtualPageDetails = {
    pageWidth: document.body.clientWidth,
    pageHeight: document.body.clientHeight,
    hub: 0,
    article: 0
  },
  _userSession = {},
  _userSessionParams = {},
  _sessionIntervalID,
  _user = {},
  _contentGroupID = 0,
  _defaultSessionMetricInterval = 1000 * 60, // 1 minute
  _didFireFirstInteraction = false,
  _metricsRetryQueue = new Map(),
  _retryBaseInterval = 1000 * 10; // 10 seconds

/**
 * A class of metrics helpers.
 */
class Metrics extends EventifierStatic {
  /**
   * Returns endpoint mapping variables
   *
   * @readonly
   * @static
   */
  static get endpoints() {
    return _ENDPOINTS;
  }

  /**
   * Returns interactive ecents mapping variables
   *
   * @readonly
   * @static
   */
  static get interactiveEvents() {
    return _INTERACTION_EVENTS;
  }

  /**
   * Returns interactive ecents mapping variables
   *
   * @readonly
   * @static
   */
  static get contentEvents() {
    return _CONTENT_EVENTS;
  }

  /**
   * Instantiates a new Metrics helper class.
   */
  constructor() {
    super();

    this._isInitialized = false;
    this._initializeOnce();

    // cpeterson - we have issues with metrics loading in an iframe. after making the follwiwng work I have decided we do not need a special case for iframes. and I have commented out his code. I have tested at diff speeds and it all works without it. I am leaving this here for legacy and if any issues come up. But i do not think we need a special case for iframes. It was causing more issues than helping.

    // if (Properties.isFriendlyIframe) {
    //   FrameMessaging.beginMessage(window.parent, { type: 'mraid', func: 'isViewable' }, data => {
    //     if (data === null || data === undefined || data.toString().toLowerCase() === 'true') {
    //       this._initializeOnce();

    //       // the initial route change (to set content_started) would have been missed since
    //       // it fired before the event listeners set up in _initializeOnce(). So fire the initial
    //       // content_started event now.
    //       //
    //       // This method doers not exist. @todo - what is this for? is it needed?
    //       //this.metricContentStarted(Router.currentRoute);
    //     } else {
    //       window.addEventListener('message', e => {
    //         let message = e.data || e.originalEvent.data;
    //         if (message.event === 'viewableChange' && message.value) {    // data.value === isViewable
    //           this._initializeOnce();

    //           // the initial route change (to set content_started) would have been missed since
    //           // it fired before the event listeners set up in _initializeOnce(). So fire the initial
    //           // content_started event now.

    //           //
    //           //This method doers not exist. @todo - what is this for? is it needed?
    //           //this.metricContentStarted(Router.currentRoute);
    //         }
    //       });
    //     }
    //   });
    // } else {
    //   this._initializeOnce();
    // }
  }

  /**
   * Initializes metrics for the Microzines; includes a guard so it can only be called once.
   * @returns {void}
   * @private
   */
  _initializeOnce() {
    if (this._isInitialized) {
      return;
    } // can only initialize once

    Logger.log('Initializing Metrics API');
    this._isInitialized = true;

    Storage.setItem('lastContentConsumedSent', Date.now());
    _userSession = this._createUserSession();
    _userSessionParams = {
      b: Properties.brand,
      sid: _userSession.id,
      d: 0,
      e: Properties.entryPage,
      aid: Properties.appID,
      av: Properties.appVersion,
      mtrv: 'JS2.0',
      ua: encodeURIComponent(navigator.userAgent),
      plat: Properties.platform.toLowerCase()
    };
    this._addCreativeData();

    this._runSessionMonitor();

    this._setupVisibility();
    this._setupEventHandlers();

    this._setupUser();
    this.fireUserSession();
    Logger.info('Initialized Metrics');
  }

  _setupUser() {
    let userStorage = Storage.getItem('user'),
      userData = {};
    if (!userStorage) {
      userData = {
        id: Utils.createUUID(),
        new: true
      };
    } else {
      // already have the user
      userData = {
        id: userStorage.id,
        new: false
      };
    }

    Storage.setItem('user', userData);
    _user = userData;
    _user.new
      ? Logger.info(`Created new user: ${_user.id}`)
      : Logger.info(`Previous user: ${_user.id}`);
  }

  /**
   * Adds macros from the creative to the user session metric.
   * @private
   * @returns {void}
   */
  _addCreativeData() {
    if (window.creativeData) {
      for (let [k, v] of this.CREATIVE_DATA_MAPPING) {
        if (window.creativeData[v]) {
          _userSessionParams[k] = window.creativeData[v];
        }
      }
    }
  }

  /**
   * Sets up visibility event handlers depending on which browser/environment we are in.
   * @private
   * @returns {void}
   */
  _setupVisibility() {
    if (Properties.isFriendlyIframe) {
      _hiddenProp = 'mraid_viewable';

      window.addEventListener('message', e => {
        let message = e.data || e.originalEvent.data;
        if (message.event === 'viewableChange') {
          document[_hiddenProp] = !message.value; // visibility API based on "is hidden", mraid based on "is viewable"
          this._handlePageVisibilityChange();
        }
      });

      return;
    }

    // so many vendor prefixes...
    if (typeof document.hidden !== 'undefined') {
      _hiddenProp = 'hidden';
      document.addEventListener(
        'visibilitychange',
        this._handlePageVisibilityChange.bind(this)
      );
    } else if (typeof document.mozHidden !== 'undefined') {
      _hiddenProp = 'mozHidden';
      document.addEventListener(
        'mozvisibilitychange',
        this._handlePageVisibilityChange.bind(this)
      );
    } else if (typeof document.msHidden !== 'undefined') {
      _hiddenProp = 'msHidden';
      document.addEventListener(
        'msvisibilitychange',
        this._handlePageVisibilityChange.bind(this)
      );
    } else if (typeof document.webkitHidden !== 'undefined') {
      _hiddenProp = 'webkitHidden';
      document.addEventListener(
        'webkitvisibilitychange',
        this._handlePageVisibilityChange.bind(this)
      );
    }
  }

  /**
   * Creates event handlers for all interactions that might require metrics to be fired.
   * @private
   * @returns {void}
   */
  _setupEventHandlers() {
    Router.addEventListener('routechange', this._onRouteChange.bind(this));
    VideoMetrics.addEventListener(
      'videostarted',
      this._onVideoStarted.bind(this)
    );
    VideoMetrics.addEventListener(
      'videounregistered',
      this._onVideoUnregistered.bind(this)
    );
    VideoMetrics.addEventListener(
      'videoReportQuartile',
      this._onVideoReportQuartile.bind(this)
    );
    SharingManager.addEventListener(
      'shareclicked',
      this._onShareClicked.bind(this)
    );
    MicrozineEvents.addEventListener(
      'relateditemclicked',
      this._onRelatedItemClicked.bind(this)
    );
    MicrozineEvents.addEventListener(
      'shoppableitemclicked',
      this._onShoppableItemClicked.bind(this)
    );
    MicrozineEvents.addEventListener(
      'pageswipe',
      this._onPageSwiped.bind(this)
    );
    MicrozineEvents.addEventListener(
      'scrollended',
      this._onScrollEnded.bind(this)
    );
    MicrozineEvents.addEventListener(
      'microzineready',
      this._onMicrozineReady.bind(this)
    );
    document.addEventListener('click', this._onPageClicked.bind(this));
    document.addEventListener('beforeunload', this._onPageUnload.bind(this));
    window.addEventListener('pagehide', this._onPageUnload.bind(this));
    if (Properties.isFriendlyIframe) {
      document
        .getElementById('content')
        .addEventListener('scroll', this._onScroll.bind(this));
    } else {
      document.addEventListener('scroll', this._onScroll.bind(this));
    }

    // if (document.getElementById('brand_header')) {
    //   document.getElementById('brand_header').addEventListener('click', this._onHeaderClicked.bind(this));
    // }

    if (Properties.isFriendlyIframe) {
      window.addEventListener('message', e => {
        let message = e.data || e.originalEvent.data;
        if (message.event === 'stateChange' && message.value === 'hidden') {
          this._onPageUnload();
        }
      });
    }
  }

  /**
   * Fires when the Microzine has been completely loaded and is ready to render for the first time.
   * @private
   * @returns {void}
   */
  _onMicrozineReady() {
    this.fireLoad();
  }

  /**
   * Fires when the Microzine is navigating to a new page.
   * @param {Object} e - Route event args
   * @private
   * @returns {void}
   */
  _onRouteChange(e) {
    // TODO: not yet checking doFireMetrics; that would help us determine whether to fire the contentLoaded but we don't know if we were supposed to fire contentConsumed

    // firing content_consumed metric for OLD URL because it should be fired once content has ALREADY BEEN consumed to get the correct duration
    if (e.oldRoute) {
      this.fireContentPageConsumed(e.oldRoute);
    }

    // create new content group for metrics
    _contentGroupID++;
    Storage.setItem('contentGroupID', _contentGroupID);

    // now fire the content_started metrics for the NEW URL
    this.fireContentPageStarted(e.newRoute);

    // this is to reset the article virtual page number back to 0
    _virtualPageDetails.article = 0;
  }

  /**
   * Fires when a video starts playing.
   * @param {Object} e - Video event args
   * @private
   * @returns {void}
   */
  _onVideoStarted(e) {
    this.fireContentVideoStarted(e.videoID, e.referringRoute, e.playerType);
  }

  /**
   * Fires when a video is unregistered from the current page.
   * @param {Object} e - Video event args
   * @private
   * @returns {void}
   */
  _onVideoUnregistered(e) {
    if (e.didPlay) {
      this.fireContentVideoConsumed(e.videoID, e.playingDuration, e.maxPercent);
    }
  }

  /**
   * Fires when a video has played start, 25, 50, 75, complete.
   * @param {Object} e - Video event args
   * @private
   * @returns {void}
   */
  _onVideoReportQuartile(e) {
    this.fireContentVideoQuartile(e.videoID, e.quartileValue);
  }

  /**
   * Fires when the Microzine is about to be torn down and closed completely (i.e. the browser window is being closed)
   * @private
   * @returns {void}
   */
  _onPageUnload() {
    if (!this._isInitialized || _isUnloaded) {
      return;
    } // only run unload once, even if fired from multiple events

    _isUnloaded = true;
    Logger.info('Unloading Metrics');

    Storage.setItem('pageUnloaded', Date.now());

    VideoMetrics.runUnloadEvents();
    this.fireContentPageConsumed(Router.currentRoute);
    this.fireUserSession();
  }

  /**
   * Fires when the page is clicked or tapped; used to fire button and link metrics.
   * @param {Object} e - Mouse event args
   * @private
   * @returns {void}
   */
  _onPageClicked(e) {
    /*eslint-disable no-cond-assign*/
    let button, anchor;

    if ((button = Utils.closest(e.target, 'button'))) {
      this.fireInteractionButtonClicked(
        button.getAttribute('data-id') || button.id
      );
    } else if ((anchor = Utils.closest(e.target, 'a[href]'))) {
      let url = anchor.getAttribute('href');

      // if the URL doesn't have http:, https:, tel:, or mailto: scheme, return
      if (!/^(https?|tel|mailto):/.test(url)) {
        return;
      }

      if (!url.startsWith(location.origin)) {
        this.fireInteractionLinkClicked(
          url,
          anchor.getAttribute('data-id') || anchor.id
        );
      }
    }
    /*eslint-enable no-cond-assign*/
  }

  /**
   * Fires when a related item tile is clicked or tapped.
   * @param {Object} e - Event args
   * @private
   * @returns {void}
   */
  _onRelatedItemClicked(e) {
    this.fireInteractionRelatedItemClicked(e.url, e.title);
  }

  /**
   * Fires when a shoppable item tile is clicked or tapped.
   * @param {Object} e - Event args
   * @private
   * @returns {void}
   */
  _onShoppableItemClicked(e) {
    this.fireInteractionShoppableItemClicked(e.url, e.title);
  }

  /**
   * Fires when a page is swiped or scrolled up/down.
   * @param {Object} e - Event args
   * @private
   * @returns {void}
   */
  _onPageSwiped(e) {
    // don't fire if we are animating; don't want phantom events
    if (Router.canNavigate) {
      this.fireInteractionPageSwiped(e.direction);
    }
  }

  /**
   * Fires when a share button is clicked or tapped.
   * @param {Object} e - Share event args
   * @private
   * @returns {void}
   */
  _onShareClicked(e) {
    this.fireInteractionShareButtonClicked(e.baseHref, e.service);
  }

  /**
   * Fires when the page is being swiped or scrolled up/down.
   * @private
   * @returns {void}
   */
  _onScroll() {
    let dispatcher = () => {
      let scrollY = Properties.isFriendlyIframe
        ? document.getElementById('content').scrollTop
        : window.scrollY;
      let delta = _scrollMetricsDetails.startY - scrollY;
      if (Router.canNavigate && Math.abs(delta) > 10) {
        this._onPageSwiped({
          direction: delta < 0 ? 'up' : 'down'
        });
      }

      _scrollMetricsDetails.startY = undefined;
    };

    if (!_scrollMetricsDetails.ticking) {
      if (_scrollMetricsDetails.startY === undefined) {
        _scrollMetricsDetails.startY = Properties.isFriendlyIframe
          ? document.getElementById('content').scrollTop
          : window.scrollY;
      }

      window.requestAnimationFrame(() => {
        clearTimeout(_scrollMetricsDetails.dispatcherID);
        _scrollMetricsDetails.dispatcherID = setTimeout(dispatcher, 300);
        _scrollMetricsDetails.ticking = false;
      });
    }

    _scrollMetricsDetails.ticking = true;
  }

  /**
   * Fires when the user has stopped scrolling, and checks to see if one or more virtual page events need to be fired.
   * @private
   * @returns {void}
   */
  _onScrollEnded() {
    let clientW = document.body.clientWidth,
      clientH = document.body.clientHeight,
      scrollY = Properties.isFriendlyIframe
        ? document.getElementById('content').scrollTop
        : window.scrollY,
      currentPage = Math.round(scrollY / clientH), // rounding because the header makes the first page only half a page anyway
      pageType = Router.getPageType(Router.currentRoute),
      fillGaps = true;

    if (
      clientW !== _virtualPageDetails.pageWidth ||
      clientH !== _virtualPageDetails.pageHeight
    ) {
      Logger.warn('Page has been resized!');
      _virtualPageDetails.pageWidth = clientW;
      _virtualPageDetails.pageHeight = clientH;
      fillGaps = false;
    }

    if (Router.canNavigate && currentPage !== _virtualPageDetails[pageType]) {
      if (fillGaps) {
        if (currentPage > _virtualPageDetails[pageType]) {
          for (
            let p = _virtualPageDetails[pageType] + 1;
            p <= currentPage;
            p++
          ) {
            this.fireInteractionVirtualPageViewed(p);
          }
        } else {
          for (
            let p = _virtualPageDetails[pageType] - 1;
            p >= currentPage;
            p--
          ) {
            this.fireInteractionVirtualPageViewed(p);
          }
        }
      } else {
        this.fireInteractionVirtualPageViewed(currentPage);
      }
    }
    _virtualPageDetails[pageType] = currentPage;
  }

  /**
   * Creates a new user session object.
   * @returns {{id: string, startTime: number, lastReported: number, hiddenAt: null, totalHiddenDuration: number}} - User session object
   * @private
   */
  _createUserSession() {
    let now = Date.now();

    let session = {
      id: Utils.createUUID(),
      startTime: now,
      lastReported: now,
      hiddenAt: null,
      totalHiddenDuration: 0
    };
    Logger.info(`Created new user session: ${session.id}`);

    return session;
  }

  /**
   * Starts a timer to fire the session metric at a specified interval.
   * @private
   * @returns {void}
   */
  _runSessionMonitor() {
    clearInterval(_sessionIntervalID);
    _sessionIntervalID = setInterval(
      this.fireUserSession.bind(this),
      _defaultSessionMetricInterval
    );
  }

  /**
   * Stops a timer to fire the session metric at a specified interval.
   * @private
   * @returns {void}
   */
  _pauseSessionMonitor() {
    clearInterval(_sessionIntervalID);
  }

  /**
   * Fires when the page visibility changes (for instance, a tab is backgrounded or brought back to the foreground).
   * @private
   * @returns {void}
   */
  _handlePageVisibilityChange() {
    let now = Date.now(),
      isHidden = document[_hiddenProp]; // normalizing vendor prefixes; see _initializeOnce function

    Logger.info(`visibility changed: ${isHidden ? 'hidden' : 'visible'}`);

    if (isHidden) {
      if (_isUnloaded) {
        return;
      } // sometimes we get notifications for losing visiblity *and* beforeunload; only fire once

      _isUnloaded = true;
      this._pauseSessionMonitor();

      VideoMetrics.runUnloadEvents();
      this.fireContentPageConsumed(Router.currentRoute);
      this.fireUserSession();

      _userSession.hiddenAt = now;
      Storage.setItem('hiddenAt', now);
    } else {
      _isUnloaded = false;

      _userSession.totalHiddenDuration += now - _userSession.hiddenAt;

      Storage.removeItem('hiddenAt');

      this._runSessionMonitor();
    }
  }

  /**
   * Loads the tracking pixel into the tracking container.
   * @param {string} src - Tracking pixel URL to load
   * @param {Object} metadata - Metadata for this particular metric, keeps track of how many times it has been attempted, etc
   * @private
   * @returns {void}
   */
  _loadPixel(src, metadata) {
    let pxContainer = document.getElementById('tracking_px_container'),
      px = document.createElement('img');

    if (!metadata) {
      metadata = { times: 0, refireAfter: Date.now() };
      _metricsRetryQueue.set(src, metadata);
    }

    metadata.times++;
    metadata.refireAfter = Date.now() + _retryBaseInterval * metadata.times;

    if (metadata.times > 10) {
      _metricsRetryQueue.delete(src);
    }

    px.src = src + (metadata.times > 1 ? `&refire=${metadata.times - 1}` : '');
    px.onload = () => {
      pxContainer.removeChild(px);
      _metricsRetryQueue.delete(src);
    };
    pxContainer.appendChild(px);
  }

  /**
   * Checks to see if any pixels need to be refired.
   * @private
   * @returns {void}
   */
  _refirePixels() {
    let now = new Date();

    for (let [src, metadata] of _metricsRetryQueue) {
      if (now > metadata.refireAfter) {
        this._loadPixel(src, metadata);
      }
    }
  }

  /**
   * Creates the pixel URL for a particular metric.
   * @param {string} endpoint - Endpoint of the metric to fire
   * @param {Object=} params - Additional parameters to be added to the metric (if any)
   * @private
   * @returns {void}
   */
  _firePixel(endpoint, params = {}) {
    let clonedParams = JSON.parse(JSON.stringify(params)),
      invalidProps = MetricsValidator.validate(endpoint, clonedParams);

    //dispatch metrics
    Metrics.broadcastEvent(endpoint, params, this.getCurrentRoute());

    if (invalidProps.length) {
      Logger.warn(`Invalid properties for ${endpoint}:`, invalidProps, params);
      return;
    }

    let query = Object.getOwnPropertyNames(clonedParams)
        .map(n => `${n}=${clonedParams[n]}`)
        .join('&'),
      src = `${Properties.pixelHost}/${endpoint}?${query}`;

    this._loadPixel(src);

    clonedParams.endpoint = endpoint;

    if (this.dispatchEvent) {
      this.dispatchEvent('metricfired', clonedParams);
    }
    // don't fire First Interaction if this is a video started event which can happen without a user gesture.
    if (
      !_didFireFirstInteraction &&
      params.tp !== this.CONTENT_EVENTS.videoStarted &&
      (endpoint === this.ENDPOINTS.interaction ||
        (endpoint === this.ENDPOINTS.content && params.rcid))
    ) {
      this.fireFirstInteraction();
    }

    // fire First Interaction if it has not been fired before AND a video hits 25%
    if (
      !_didFireFirstInteraction &&
      params.tp === this.CONTENT_EVENTS.videoQuartile &&
      params.q === 25
    ) {
      this.fireFirstInteraction();
    }

    this._refirePixels();
  }

  /**
   * Dispatch metric fired event.
   *
   * @static
   * @param {string} endpoint - Endpoint of the metric to fire
   * @param {Object=} params - Additional parameters to be added to the metric (if any)
   * @param {string} [route="/"] - current route.
   */
  static broadcastEvent(endpoint, params = {}, route = '/') {
    this.dispatchEvent('metricfired', {
      endpoint: endpoint,
      params: params,
      route: route
    });
  }

  /**
   * Returns the current route, or defaults to the root.
   * Added to support MZ's that are not using the Router and do not have a current route.
   *
   * @returns {string} - current route
   */
  getCurrentRoute() {
    return Router.currentRoute.route
      ? Router.currentRoute.route.join('/')
      : '/';
  }

  /**
   * Used to define the load duration of a MZ.
   * Use NOW and value defined on global object to return load time in milliseconds.
   * @returns {number} return load time in milliseconds.
   */
  defineLoadEnd() {
    return window.ZBI_MZCONFIG.ls ? Date.now() - window.ZBI_MZCONFIG.ls : '';
  }

  /**
   * Fires a "Microzine loaded" pixel metric.
   * @returns {void}
   */
  fireLoad() {
    // keep checking if Router.currentRoute.route is an object and then if it has data
    if (
      typeof Router.currentRoute.route === 'object' &&
      Object.keys(Router.currentRoute.route).length !== 0
    ) {
      let params = {
        b: Properties.brand,
        rcid: encodeURIComponent(Router.currentRoute.route.join('/')),
        uid: _user.id,
        sid: _userSession.id,
        nu: _user.new,
        t: Date.now(),
        d: this.defineLoadEnd()
      };

      this._firePixel(this.ENDPOINTS.load, params);
    } else {
      setTimeout(() => {
        Logger.warn('Could not find current route! retrying...');
        this.fireLoad();
      }, 1000);
    }
  }

  /**
   * Fires a "first interaction" pixel metric.
   * @returns {void}
   */
  fireFirstInteraction() {
    let params = {
      b: Properties.brand,
      rcid: encodeURIComponent(this.getCurrentRoute()),
      sid: _userSession.id,
      t: Date.now()
    };

    this._firePixel(this.ENDPOINTS.firstInteraction, params);
    _didFireFirstInteraction = true;
  }

  /**
   * Fires a "user session" pixel metric.
   * @returns {void}
   */
  fireUserSession() {
    let params = _userSessionParams,
      now = Date.now();

    params.d = Utils.m2s(
      now - _userSession.startTime - _userSession.totalHiddenDuration
    );
    params.t = now;

    this._firePixel(this.ENDPOINTS.userSession, params);
    _userSession.lastReported = now;
  }

  /**
   * Fires a "page started" pixel metric.
   * @param {Object} routeObj - Route parameters
   * @returns {void}
   */
  fireContentPageStarted(routeObj) {
    let now = Date.now(),
      params = {
        b: Properties.brand,
        tp: this.CONTENT_EVENTS.pageStarted,
        rcid: encodeURIComponent(routeObj.referrer.join('/')),
        cid: encodeURIComponent(routeObj.route.join('/')),
        sid: _userSession.id,
        src: routeObj.source || '',
        cg: _contentGroupID,
        pt: routeObj.type,
        tg: encodeURIComponent(JSON.stringify(routeObj.tags || '')),
        t: now
      };

    this._firePixel(this.ENDPOINTS.content, params);
    Storage.setItem('lastContentStartedSent', now);
  }

  /**
   * Fires a "page consumed" pixel metric.
   * @param {Object} routeObj - Route parameters
   * @returns {void}
   */
  fireContentPageConsumed(routeObj) {
    if (!routeObj.route) {
      return;
    }

    let now = Date.now(),
      lastStartedSent = Storage.getItem('lastContentStartedSent'),
      hiddenDuration = Storage.getItem('hiddenDuration') || 0,
      params = {
        b: Properties.brand,
        tp: this.CONTENT_EVENTS.pageConsumed,
        cid: encodeURIComponent(routeObj.route.join('/')),
        sid: _userSession.id,
        src: routeObj.source || '',
        d: Utils.m2s(now - lastStartedSent - hiddenDuration),
        cg: _contentGroupID,
        t: now
      };

    this._firePixel(this.ENDPOINTS.content, params);
  }

  /**
   * Fires a "video started" pixel metric.
   * @param {string} videoID - ID of the video
   * @param {Object} routeObj - Route parameters
   * @returns {void}
   */
  fireContentVideoStarted(videoID, routeObj, playerType) {
    let params = {
      b: Properties.brand,
      tp: this.CONTENT_EVENTS.videoStarted,
      rcid: encodeURIComponent(routeObj.route.join('/')),
      cid: encodeURIComponent(videoID),
      sid: _userSession.id,
      src: routeObj.source || '',
      cg: _contentGroupID,
      vpt: playerType,
      tg: [], // currently we don't have video tags, but we might someday
      t: Date.now()
    };

    this._firePixel(this.ENDPOINTS.content, params);
  }

  /**
   * Fires a "video consumed" pixel metric.
   * @param {string} videoID - ID of the video
   * @param {number} duration - Number of seconds the video was being played
   * @param {number} maxPercent - Percent as a float (0..1) that represents the farthest position in which the video was played
   *
   * We need both `duration` and `maxPercent` because they represent two different things; consider for a 10-second video:
   *  - plays for 5 seconds and then stops; `duration` would be 5 and `maxPercent` would be 0.5
   *  - plays for 5 seconds and then scrubs back to beginning, then watches for three more seconds; `duration` would be 8 and `maxPercent` would be 0.5
   *  - plays for 2 seconds and then scrubs to end; `duration` would be 2 and `maxPercent` would be 1.0
   *
   * @returns {void}
   */
  fireContentVideoConsumed(videoID, duration, maxPercent) {
    let hiddenDuration = Storage.getItem('hiddenDuration') || 0,
      params = {
        b: Properties.brand,
        tp: this.CONTENT_EVENTS.videoConsumed,
        cid: encodeURIComponent(videoID),
        sid: _userSession.id,
        d: Utils.m2s(duration - hiddenDuration),
        cg: _contentGroupID,
        pct: maxPercent,
        t: Date.now()
      };

    this._firePixel(this.ENDPOINTS.content, params);
  }

  /**
   * Fires Metric at the 25, 50, 75 and onComplete point of the video.
   *
   * @param {string} videoID - video id
   * @param {number} quartileValue - value
   */
  fireContentVideoQuartile(videoID, quartileValue) {
    let params = {
      b: Properties.brand,
      tp: this.CONTENT_EVENTS.videoQuartile,
      cid: encodeURIComponent(videoID),
      sid: _userSession.id,
      q: quartileValue,
      cg: _contentGroupID,
      t: Date.now()
    };

    this._firePixel(this.ENDPOINTS.content, params);
  }

  /**
   * Fires a "link clicked" pixel metric.
   * @param {string} url - URL that the link points to
   * @param {string} elementId - ID of the element that was clicked
   * @returns {void}
   */
  fireInteractionLinkClicked(url, elementId) {
    let params = {
      b: Properties.brand,
      tp: this.INTERACTION_EVENTS.linkClicked,
      rcid: encodeURIComponent(this.getCurrentRoute()),
      sid: _userSession.id,
      cg: _contentGroupID,
      url: encodeURIComponent(url),
      eid: elementId || 'lnk',
      t: Date.now()
    };

    this._firePixel(this.ENDPOINTS.interaction, params);
  }

  /**
   * Fires a "button clicked" pixel metric.
   * @param {string} elementId - ID of the element that was clicked
   * @returns {void}
   */
  fireInteractionButtonClicked(elementId) {
    let params = {
      b: Properties.brand,
      tp: this.INTERACTION_EVENTS.buttonClicked,
      rcid: encodeURIComponent(this.getCurrentRoute()),
      sid: _userSession.id,
      cg: _contentGroupID,
      eid: elementId || 'btn',
      t: Date.now()
    };

    this._firePixel(this.ENDPOINTS.interaction, params);
  }

  /**
   * Fires a "related item clicked" pixel metric.
   * @param {string} url - URL of the related item
   * @param {string} title - Title of the related item
   * @returns {void}
   */
  fireInteractionRelatedItemClicked(url, title) {
    let params = {
      b: Properties.brand,
      tp: this.INTERACTION_EVENTS.relatedItemClicked,
      rcid: encodeURIComponent(this.getCurrentRoute()),
      sid: _userSession.id,
      cg: _contentGroupID,
      url: encodeURIComponent(url),
      tl: encodeURIComponent(title),
      t: Date.now()
    };

    this._firePixel(this.ENDPOINTS.interaction, params);
  }

  /**
   * Fires a "shoppable item clicked" pixel metric.
   * @param {string} url - URL of the shoppable item
   * @param {string} title - Title of the shoppable item
   * @returns {void}
   */
  fireInteractionShoppableItemClicked(url, title) {
    let params = {
      b: Properties.brand,
      tp: this.INTERACTION_EVENTS.shoppableItemClicked,
      rcid: encodeURIComponent(Router.currentRoute.route.join('/')),
      sid: _userSession.id,
      cg: _contentGroupID,
      url: encodeURIComponent(url),
      tl: encodeURIComponent(title),
      t: Date.now()
    };

    this._firePixel(this.ENDPOINTS.interaction, params);
  }

  /**
   * Fires a "share button clicked" pixel metric.
   * @param {string} url - Full URL sent to the social service
   * @param {string} service - Name of the social service
   * @returns {void}
   */
  fireInteractionShareButtonClicked(url, service) {
    let params = {
      b: Properties.brand,
      tp: this.INTERACTION_EVENTS.shareButtonClicked,
      rcid: encodeURIComponent(Router.currentRoute.route.join('/')),
      sid: _userSession.id,
      cg: _contentGroupID,
      url: encodeURIComponent(url),
      svc: service,
      t: Date.now()
    };

    this._firePixel(this.ENDPOINTS.interaction, params);
  }

  /**
   * Fires a "page swiped" pixel metric.
   * @param {string} direction - "up" if the user swiped up, otherwise "down"
   * @returns {void}
   */
  fireInteractionPageSwiped(direction) {
    let params = {
      b: Properties.brand,
      tp: this.INTERACTION_EVENTS.pageSwiped,
      rcid: encodeURIComponent(Router.currentRoute.route.join('/')),
      sid: _userSession.id,
      cg: _contentGroupID,
      dir: direction,
      t: Date.now()
    };

    this._firePixel(this.ENDPOINTS.interaction, params);
  }

  /**
   * Fires a "virtual page" pixel metric.
   * @param {number} pageNumber - The page number that was viewed
   * @returns {void}
   */
  fireInteractionVirtualPageViewed(pageNumber) {
    let params = {
      b: Properties.brand,
      tp: this.INTERACTION_EVENTS.virtualPageViewed,
      rcid: encodeURIComponent(Router.currentRoute.route.join('/')),
      sid: _userSession.id,
      cg: _contentGroupID,
      pn: pageNumber,
      t: Date.now()
    };

    this._firePixel(this.ENDPOINTS.interaction, params);
  }

  /**
   * Maps types of events to their short endpoint name.
   * @returns {{impression: string, load: string, firstInteraction: string, userSession: string, content: string, interaction: string}} - Endpoint map
   */
  get ENDPOINTS() {
    return _ENDPOINTS;
  }

  /**
   * Maps types of content events to their short "type" parameter name.
   * @returns {{pageStarted: string, pageConsumed: string, videoStarted: string, videoConsumed: string}} - Content event map
   */
  get CONTENT_EVENTS() {
    return _CONTENT_EVENTS;
  }

  /**
   * Maps types of interaction events to their short "type" parameter name.
   * @returns {{linkClicked: string, buttonClicked: string, relatedItemClicked: string, shoppableItemClicked: string, shareButtonClicked: string, pageSwiped: string, virtualPageViewed: string}} - Interaction event map
   */
  get INTERACTION_EVENTS() {
    return _INTERACTION_EVENTS;
  }

  /**
   * Maps different macros from The Trade Desk to pixel metric query parameters.
   * @returns {Map} - Map of the macros to query parameters
   */
  get CREATIVE_DATA_MAPPING() {
    return _CREATIVE_DATA_MAPPING;
  }

  /**
   * Returns user session data, this is exposed here so extensions of Metrics can receive the variable
   *
   * @readonly
   * @static
   */
  get userSession() {
    return _userSession;
  }

  /**
   * Returns user data, this is exposed here so extensions of Metrics can receive the variable
   *
   * @readonly
   * @static
   */
  get user() {
    return _user;
  }
}

export default Metrics;
