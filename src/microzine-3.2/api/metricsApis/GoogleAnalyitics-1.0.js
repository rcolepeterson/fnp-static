const Logger = require('api/Logger');

/**
 * Google Analyitics:
 * this is currently being used in our old Metrics-0.9.js to take
 * events and translate them to Google Analytics
 *
 * TODO: remove:
 * 'eventCategory': 'mz'
 * this was set as mz because Tmobile wanted a mz category, we should replace this with more useful information like interaction_event or something
 *
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference
 *
 */
export default class GA {
  /**
   * metric from zumobi's Metrics-0.9 is passed here and prepairs it for Google Analytics
   *
   * @param {obj} metric - metrics passed in from the event
   * @returns {obj} - objects that were passed as an event would be, expected input:
   */
  static metricToGA(metric) {
    let eventCat = { eventCategory: 'mz' };

    // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
    // hitType must be one of 'pageview', 'screenview', 'event', 'transaction', 'item', 'social', 'exception', 'timing'.
    switch (metric.metric_name) {
      case 'new_user_activated':
        return {
          hitType: 'event',
          data: Object.assign(eventCat, { eventAction: 'new_user_activated' })
        };
      case 'interaction_event':
        return this.interactionCases(metric, eventCat);
      case 'content_started':
        return {
          hitType: 'event',
          data: Object.assign(eventCat, {
            eventAction: 'content_started',
            eventLabel: metric.content_id
          })
        };
      case 'content_consumed':
        return {
          hitType: 'event',
          data: Object.assign(eventCat, {
            eventAction: 'content_consumed',
            eventLabel: metric.duration
          })
        };
      case 'user_session_updated':
        return {
          hitType: 'pageview',
          data: Object.assign(eventCat, { sessionControl: 'start' })
        };
      case 'content_session_updated':
        return {
          hitType: 'event',
          data: Object.assign(eventCat, {
            eventAction: 'content_session_updated'
          })
        };
      case 'video_started':
        return {
          hitType: 'event',
          data: Object.assign(eventCat, {
            eventAction: 'video_started',
            eventLabel: metric.referring_content_id
          })
        };
      case 'video_consumed':
        return {
          hitType: 'event',
          data: Object.assign(eventCat, {
            eventAction: 'video_consumed',
            eventLabel: `${metric.percent_complete}%`
          })
        };
      case 'user_profile_updated':
        return {
          hitType: 'event',
          data: Object.assign(eventCat, { eventAction: 'user_profile_updated' })
        };
      case 'external_link_clicked':
        return {
          hitType: 'event',
          data: Object.assign(eventCat, {
            eventAction: 'external_link_clicked',
            transport: 'beacon'
          })
        };
      default:
        return;
    }
  }

  static interactionCases(metric, eventCat) {
    switch (metric.type) {
      case 'button_click':
        return {
          hitType: 'event',
          data: Object.assign(eventCat, {
            eventAction: 'button_click',
            eventLabel: metric.element_id
          })
        };
      case 'external_link_click':
        return {
          hitType: 'event',
          data: Object.assign(eventCat, {
            eventAction: 'external_link_click',
            eventLabel: metric.url
          })
        };
      case 'header_click':
        return {
          hitType: 'event',
          data: Object.assign(eventCat, {
            eventAction: 'header_click',
            eventLabel: metric.url
          })
        };
      case 'related_item_click':
        return {
          hitType: 'event',
          data: Object.assign(eventCat, {
            eventAction: 'related_item_click',
            eventLabel: metric.title
          })
        };
      case 'shoppable_item_click':
        return {
          hitType: 'event',
          data: Object.assign(eventCat, {
            eventAction: 'shoppable_item_click',
            eventLabel: metric.title
          })
        };
      case 'page_swipe':
        return {
          hitType: 'event',
          data: Object.assign(eventCat, {
            eventAction: 'page_swipe',
            eventLabel: metric.location
          })
        };
      case 'share_click':
        return {
          hitType: 'event',
          data: Object.assign(eventCat, {
            eventAction: 'share_click',
            eventLabel: metric.service
          })
        };
      case 'virtual_page':
        // this is how far the user scrolled, currently not being sent, need to decide how to squeeze in more information
        return {
          hitType: 'event',
          data: Object.assign(eventCat, {
            eventAction: 'virtual_page',
            eventLabel: metric.location
          })
        };
      default:
        return;
    }
  }
  /**
   * Provides a place to send metrics that will be turned into GA metrics
   *
   * @static
   * @param {Object} metrics, common_attributes, app, app_version -  metrics coming from events. common_attributes, app, app_version aren't used yet
   * @returns {void}
   * @memberof GA
   */
  static send({ metrics, common_attributes, app, app_version }) {
    if (!metrics) {
      Logger.error(
        "Google analytics doesn't have a metric to send but was called to send something"
      );
    }

    // TMOBILE NOTE: I'm not sending any metrics that don't relate to videos or content,
    // if you want to reuse this class please remove this filter. Keep the map though.
    let metricsGA = metrics
      .filter(metric => {
        let mn = metric.metric_name;
        if (
          mn === 'content_started' ||
          mn === 'content_consumed' ||
          mn === 'video_started' ||
          mn === 'video_consumed'
        ) {
          return true;
        }
        return false;
      })
      .map(metric => {
        return this.metricToGA(metric);
      });

    metricsGA.forEach(metricGA => {
      if (!metricGA) {
        return;
      }
      window.ga('send', metricGA.hitType, metricGA.data);
      Logger.log(
        `Google Analytics sent: 'send, ${metricGA.hitType}, ${JSON.stringify(
          metricGA.data
        )}'`
      );
    });
  }
}
