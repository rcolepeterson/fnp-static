/**
 * FBnalytics - Fires off a FB event. Values originate and are dispatched by the Metrics 3.0 class.
 *
 * @param {Object} e - object holding metric params. endpoint string, param object and route string.
 * @returns {void}
 */
export default ({ endpoint, params, route }) => {
  if (!endpoint || !params || !route) {
    console.warn(
      'facebookWebAnalytics:',
      'Missing param. will not be reporting anything.'
    );
    return;
  }

  if (!window.FB || !window.FB.AppEvents) {
    console.warn('FacebookWebAnalytics:', 'FB not initailized yet.');
    return;
  }

  let event = endpoint;
  // custom logic that effects how values show up in the FB dashboard.
  // we are appending event types to the event name.
  if (params && params.tp && params.tp !== void 0) {
    event = `${endpoint}-${params.tp}`;
  }
  let objMap = new Map(Object.entries(params));
  // FB does not recoginze params with only 1 character in the key. So ... prepend mz- to each key.
  let modifiedParams = {};
  objMap.forEach((item, key) => {
    let newKey = `mz-${key}`;
    let newObject = { [newKey]: item };
    Object.assign(modifiedParams, newObject);
  });
  window.FB.AppEvents.logEvent(`mz-event-${event}`, null, modifiedParams);
  // if the user is viewing content ... record a page view.
  //if (params.tp === 'this.CONTENT_EVENTS.pageStarted') {
  if (params.tp === 'ps') {
    window.FB.AppEvents.logEvent('mz-event-pageview', null, { route: route });
  }
};
