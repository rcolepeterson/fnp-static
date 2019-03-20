import Logger from 'microzine-3.2/helpers/Logger';

const throwIfMissing = () => {
  Logger.error('touchIcons: No Properties object.');
};
/**
 * Set the proper touch icon & title
 * @param {Object} Properties - Object holding global properties. /helpers/MicrozineProperties
 */
const touchIcons = (Properties = throwIfMissing()) => {
  let linkElem = document.querySelector('link[rel="apple-touch-icon"]'),
    webAppTitle = document.querySelector(
      'meta[name="apple-mobile-web-app-title"]'
    );

  if (!linkElem) {
    linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'apple-touch-icon');
    document.querySelector('head').appendChild(linkElem);
  }

  linkElem.setAttribute(
    'href',
    `${Properties.basePath}/${Properties.touchIcon}`
  );

  if (!webAppTitle) {
    webAppTitle = document.createElement('meta');
    webAppTitle.setAttribute('name', 'apple-mobile-web-app-title');
    document.querySelector('head').appendChild(webAppTitle);
  }
  webAppTitle.setAttribute('content', Properties.documentTitle);
  document.title = Properties.documentTitle;
};

export default touchIcons;
