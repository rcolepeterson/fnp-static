import Metrics from 'microzine-3.2/api/Metrics';
import Logger from 'microzine-3.2/helpers/Logger';

const throwIfMissing = () => {
  Logger.error('HasOffersTracking: No configurartion object.');
};

const ZZ_TRACKING = 'zz::tracking';
/**
 * Creates src to use for pixel img.
 * @param {Object} configuration  campaign specific hasOffer properties.
 * @returns {Object} HasOffers tracking object.
 */
const HasOffersTracking = (configuration = throwIfMissing()) => {
  const container = document.getElementById('tracking_px_container');
  const hasOffersURL = 'https://zumobi.go2cloud.org/aff_i?offer_id=';
  const hasOffersGoalURL = 'https://zumobi.go2cloud.org/aff_goal?a=l&goal_id=';
  const config = configuration;

  /*******
     img tags
     *******/

  /**
   * Append pixel to the DOM.
   * @param {string} src pixel src holding tags.
   */
  const fireConversionImg = src => {
    let img = document.createElement('img');
    img.src = src;
    img.onload = function() {
      container.removeChild(img);
    };
    container.appendChild(img);
  };

  /**
   * Creates src to use for pixel img.
   * @param {string} affid  hasOffers id.
   * @param {string} source video metric. impression || 25 || 50 || 75 || 100
   * @param {string} url location of tag. videoid || route
   * @returns {string} string to use for img src.
   */
  const buildOfferImgSrc = (affid, source = '', url = '') => {
    if (!affid) {
      Logger.warn(
        'HasOffers Tracking buildOfferImgSrc: You did not pass in a affid'
      );
    }
    let creativeData = window.creativeData;

    let s = `${hasOffersURL}${
      config.offerId
    }&aff_id=${affid}&source=${source}&aff_sub=${
      creativeData ? creativeData.site : config.noCreativeStr
    }&aff_sub2=${
      creativeData ? creativeData.supply_vendor : config.noCreativeStr
    }&aff_sub3=${
      creativeData ? creativeData.ad_group_id : config.noCreativeStr
    }&aff_sub4=${
      creativeData ? creativeData.creative_id : config.noCreativeStr
    }&source=${source}&aff_sub5=${url}&cb=${Date.now()}`;

    return s;
  };

  /***************
     IFRAME HO TAGS.
     ****************/

  /**
   * Creates iFrame element.
   *
   * @param {string} src Source of the iFrame.
   */
  const fireConversionFrame = src => {
    let iframe = document.createElement('iframe');
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.position = 'absolute';
    iframe.style.left = '0';
    iframe.style.top = '0';
    iframe.style.border = 'none';
    iframe.setAttribute('src', src);
    iframe.onload = function() {
      container.removeChild(iframe);
    };
    container.appendChild(iframe);
  };

  /**
   * Creates a URL string using macros.
   *
   * @param {string} goalID - value used to differentiate event.
   * @param {string} url - location url
   * @returns {string} - built string
   */
  const buildIframeSrc = (goalID, url) => {
    if (!goalID) {
      Logger.warn(
        'HasOffers Tracking buildIframeSrc: You did not pass in a goalID'
      );
    }

    if (!url) {
      Logger.warn(
        'HasOffers Tracking buildIframeSrc: You did not pass in a url'
      );
    }
    let creativeData = window.creativeData;

    let s = `${hasOffersGoalURL}${goalID}&aff_sub=${
      creativeData ? creativeData.site : config.noCreativeStr
    }&aff_sub2=${
      creativeData ? creativeData.supply_vendor : config.noCreativeStr
    }&aff_sub3=${
      creativeData ? creativeData.ad_group_id : config.noCreativeStr
    }&aff_sub4=${
      creativeData ? creativeData.creative_id : config.noCreativeStr
    }&aff_sub5=${url}&cb=${Date.now()}`;

    return s;
  };
  const cmsArticleTracking = (params, route) => {
    let id = null;
    let gID = '';
    let tags = JSON.parse(decodeURIComponent(params.tg));
    for (let i = 0; i < tags.length; i++) {
      let tag = tags[i];
      if (tag.indexOf(ZZ_TRACKING) !== -1) {
        id = tag.substr(13);
      }
    }
    if (id) {
      gID = buildIframeSrc(id, route);
      fireConversionFrame(gID);
      return true;
    } else {
      return false;
    }
  };

  /**
   * Event Listener
   * @param {Object} params Object holding metric varuiables
   * @param {string} route location
   * */
  const onMetricFired = ({ endpoint, params, route }) => {
    /******************
     * img conversion.
     *******************/

    let src = '';

    /**** Video Metrics */
    // quartile
    if (params.tp && params.tp === Metrics.contentEvents.videoQuartile) {
      src = buildOfferImgSrc(config.videoQuartileId, params.q, params.cid);
    }
    // start
    if (params.tp && params.tp === Metrics.contentEvents.videoStarted) {
      src = buildOfferImgSrc(config.videoQuartileId, 'impression', params.cid);
    }
    // end
    if (params.tp && params.tp === Metrics.contentEvents.videoEnded) {
      src = buildOfferImgSrc(config.videoQuartileId, '100', params.cid);
    }
    /**** Article Metrics */
    // If the user is viewing content ... record a page view.
    if (params.tp === Metrics.contentEvents.pageStarted) {
      // check url for at least 3 segments. if 3 segments than it is an article detail page and not the home page.
      // having issues with Router.currentRoute.type so do it this way.
      if (route.split('/').length > 2) {
        //  in the below code,  one of the has offers will be fired, based on
        //if goalid tag is associated with the article, cmsArticleTracking  fires has offers with goal id
        // if there is no goalid is associated with the article, default has offers, buildOfferImgSrc will be fired
        if (!cmsArticleTracking(params, route)) {
          src = buildOfferImgSrc(config.pageStartedId, '', route);
        }
      }
    }

    if (src) {
      fireConversionImg(src);
      return;
    }

    /******************
     * iFrame conversion.
     *******************/

    let f = '';
    // 1st interaction
    if (endpoint === Metrics.endpoints.firstInteraction) {
      f = buildIframeSrc(config.firstInteractionGoalId, route);
      fireConversionFrame(f);
    }
    // Swipe.
    if (params.tp && params.tp === Metrics.interactiveEvents.pageSwiped) {
      f = buildIframeSrc(config.PageSwipedGoalId, route);
      fireConversionFrame(f);
      return;
    }
    // FB
    const shareFB = () => {
      f = buildIframeSrc(config.fbGoalId, route);
      fireConversionFrame(f);
      return;
    };
    // Twitter
    const shareTwitter = () => {
      f = buildIframeSrc(config.twitGoalId, route);
      fireConversionFrame(f);
      return;
    };
    // Share
    if (params.tp === Metrics.interactiveEvents.shareButtonClicked) {
      params.svc === 'twitter' ? shareTwitter() : shareFB();
    }
  };

  return { onMetricFired };
};

export default HasOffersTracking;
