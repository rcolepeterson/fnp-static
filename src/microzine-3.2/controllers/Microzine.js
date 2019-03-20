import React, { render } from 'react'; //eslint-disable-line no-unused-vars
import Articles from 'microzine-3.2/api/Articles';
import MicrozineEvents from 'microzine-3.2/helpers/MicrozineEvents';
import Properties from 'microzine-3.2/helpers/MicrozineProperties';
import Utils from 'microzine-3.2/helpers/MicrozineUtils';
import Page from 'microzine-3.2/api/Page';
import ArticleController from 'microzine-3.2/controllers/ArticleController';
import Router from 'microzine-3.2/api/Router';
import Scroller from 'microzine-3.2/api/Scroller';
import ShareModule from 'microzine-3.2/views/ShareModule';
import BackToTop from 'microzine-3.2/views/BackToTop';
import FrontPage from 'microzine-3.2/views/FrontPageViews/FrontPage';
import EndMsg from 'microzine-3.2/views/partials/EndMsg';
import { addPromoItems } from 'microzine-3.2/helpers/utils';
import Footer from 'microzine-3.2/views/partials/Footer';
import ScrollIndicator from 'microzine-3.2/views/ScrollIndicator';
import CallToAction from 'microzine-3.2/views/partials/buttons/CtaButton';
const MAX_FAILED_COLLECTION_XHR_RETRY = 3;
let _articles = null;
let _staticCollections = null;
let xhrRetryCount = 0;
/**
 * Main Microzine controller
 *
 * @version 1.0
 */
class Microzine {
  /**
   * Creates a new instance of the Microzine controller
   */
  constructor() {
    this.checkFailedCollection = this.checkFailedCollection.bind(this);
    this.onFrontPageRendered = this.onFrontPageRendered.bind(this);
    this.init();
  }

  /**
   * Init creates the event listeners and any code that needs to run first
   *
   * @memberof Microzine
   * @returns {void}
   */
  init() {
    Scroller.addEventListener('mainPageScroll', this.handleScroll.bind(this));
    MicrozineEvents.addEventListener(
      'userprofileloaded',
      this.getArticles.bind(this)
    );
    Router.addEventListener('routechange', this.handleRouteChange.bind(this));
  }

  /**
   * Initializes call to get the Articles and static collections.
   */
  getArticles() {
    Articles.getAllArticlesFromJson(Properties.basePath).then(results => {
      _articles = results[0];
      _staticCollections = results[1];
      let sortedCollections = _staticCollections.length
        ? this.sortStaticArticles(_staticCollections)
        : [];

      Properties.articles = _articles;
      this.renderArticles(_articles, sortedCollections);
      document.querySelector('.loader').style.display = 'none';
      render(<ShareModule />, Page.getElementById('article_share'));
      render(<BackToTop />, Page.getElementById('back_to_top'));
      MicrozineEvents.dispatchEvent('microzineready');
    });
  }
  /**
   * Initializes call to get the Failed Article Collections.
   * This failure is due to XHR.timeout. NOTE: We increase the timeout value.
   */
  getFailedArticles(timeout = 10000) {
    Articles.getAllArticlesFromJson(Properties.basePath, timeout).then(
      results => {
        let articles = results[0],
          staticCollections = results[1];

        // merge the previous successful Articles with our new results.
        let mergedArticles = [..._articles, ...articles];
        // merge the previous successful static collections with our new results.
        let mergedStaticArticles = [
          ..._staticCollections,
          ...staticCollections
        ];
        Properties.articles = mergedArticles;
        _articles = mergedArticles;

        let sCollections = mergedStaticArticles.length
          ? this.sortStaticArticles(mergedStaticArticles)
          : [];

        // render the merged articles merged static collections.
        this.renderArticles(mergedArticles, sCollections);
      }
    );
  }
  /**
   * Callback fired by FrontPage.
   * We will check if any collections failed loading due to xhr.timeout.
   */
  onFrontPageRendered() {
    this.checkFailedCollection();
  }
  /**
   * Check if any collections failed to load due to time out.
   */
  checkFailedCollection() {
    // Give some time for animations. @todo - is this needed?
    setTimeout(() => {
      if (
        Articles.failedCollections.length > 0 &&
        xhrRetryCount < MAX_FAILED_COLLECTION_XHR_RETRY
      ) {
        xhrRetryCount++;
        let timeout = 10000;
        if (xhrRetryCount === 2) {
          timeout = 12000;
        }
        if (xhrRetryCount === 3) {
          timeout = 14000;
        }

        this.getFailedArticles(timeout);
      }
    }, 500);
  }

  /**
   * Sorts the static CTA's using values from thr mapping.yaml file
   *
   * @param {Array} staticArticles collection of static content
   * @returns  {Array} sorted collection of static content.
   */
  sortStaticArticles(staticArticles) {
    let staticCollections = window.StaticCollections.getStaticCollections();
    let sortedCollections = [];
    staticArticles.forEach(articles => {
      let staticType = articles[0].source;
      staticCollections.forEach(staticCollection => {
        if (staticCollection.type && staticCollection.type === staticType) {
          staticCollection.frequency = parseInt(staticCollection.frequency);
          staticCollection.initPos = parseInt(staticCollection.initPos);
          staticCollection.pos = parseInt(staticCollection.initPos);
          staticCollection.count = 0;
          staticCollection.articles = articles;
          staticCollection.articlePool = [];
          sortedCollections.push(staticCollection);
        }
      });
    });
    return sortedCollections;
  }

  /**
  |--------------------------------------------------
  | Listeners
  |--------------------------------------------------
  */

  /**
   * Scroll handler
   *
   * Run brand header animation.
   * Displatch a user scrolled event..
   * @todo move hero parallax to FrontPage.jsx
   *
   * @param {number} scrollTop Amount scrolled.
   */
  handleScroll({ scrollTop }) {
    if (scrollTop < Page.getHeroHeight()) {
      if (scrollTop > 40) {
        MicrozineEvents.dispatchEvent('userscrolled');
      }
      Utils.set3dTransform(
        Page.getElementById('brand_header'),
        0,
        40 + -scrollTop * 0.4,
        0
      );
    }
  }
  /**
   * Route Handler
   *
   * On router change handler. Show article or hub.
   * @param {Object} e Router Object
   */
  handleRouteChange(e) {
    let article = e.article;
    if (e.doShow) {
      if (article) {
        if (e.oldRoute === null || e.oldRoute.type === 'hub') {
          this.showArticle(article);
        } else {
          this.switchToArticle(article, e.oldRoute);
        }
      } else {
        this.showHub();
      }
    } else {
      Router.canNavigate = true; // set to allow Router to start accepting navigation again
    }
  }

  /**
  |--------------------------------------------------
  | Article detail page
  |--------------------------------------------------
  */

  /**
   * Article detail page animation
   *
   * @param {Article} article  api/Articles/Article
   * @param {Object} oldRoute  Router Object
   */
  switchToArticle(article, oldRoute) {
    //need a different animation if the last frame was sth to animate back correctly to prev article, related articles on close go to hub
    let animation =
      oldRoute.route[2] === 'sth'
        ? 'animate_fade_to_channels'
        : 'animate_fade_to_article';
    this.animateFrontPageOut(animation);
    this.getArticleDetail(article);
  }

  /**
   * Hides the front page content
   *
   * @param {string} animation - CSS class to apply
   */
  animateFrontPageOut(animation) {
    let frontpage = Page.getElementById('content');
    frontpage.classList.add(animation);

    setTimeout(() => {
      frontpage.classList.remove(animation);
      Router.canNavigate = true; // set to allow Router to start accepting navigation again
    }, 1000);
  }

  /**
   * Removes the current article and renders the new one.
   *
   * @param {Article} article - api/Articles/Article
   */
  getArticleDetail(article) {
    if (this.getArticleTimeOut) {
      clearTimeout(this.getArticleTimeOut);
    }

    if (this.showHubTimeOut) {
      clearTimeout(this.showHubTimeOut);
    }

    this.getArticleTimeOut = setTimeout(() => {
      ArticleController.renderArticle(article);
      this.showArticleElems();
    }, 420);
  }

  /**
   * Renders Article
   *
   * @param {Article} article  api/Articles/Article
   */
  showArticle(article) {
    ArticleController.renderArticle(article);
    this.lastScrollPos = Scroller.scrollTop;
    this.animateFrontPageOut('animate_fade_to_article');
    setTimeout(this.showArticleElems.bind(this), 420);
  }

  /**
   * Display elements for the Article Detail page.
   */
  showArticleElems() {
    Page.getElementById('wrapper').classList.add('pin_bottom', 'inherit');
    Page.getElementById('brand_header').style.display = 'none';
    Page.getElementById('article_wrapper').style.display = 'block';
    Page.getElementById('back_to_top').style.display = 'none';
    Page.getElementById('back_to_top').classList.remove('share_main');
    Page.getElementById('article_share').style.display = 'none';
    Page.getElementById('article_share').classList.remove('share_main');
    setTimeout(() => {
      Page.getElementById('article_share').style.display = 'block';
      Page.getElementById('back_to_top').style.display = 'block';
      Page.getElementById('article_close_wrapper').style.display = 'block';
    }, 600);
    Scroller.scrollTop = 0;
  }

  /**
  |--------------------------------------------------
  | Hub
  |--------------------------------------------------
  */

  /**
   * Show the HUB.
   */
  showHub() {
    if (this.getArticleTimeOut) {
      clearTimeout(this.getArticleTimeOut);
    }

    if (this.showHubTimeOut) {
      clearTimeout(this.showHubTimeOut);
    }

    setTimeout(() => {
      Page.getElementById('content').classList.add('animate_fade_to_channels');
    }, 0);
    Page.getElementById('article_share').style.display = 'none';
    Page.getElementById('back_to_top').style.display = 'none';
    Page.getElementById('article_close_wrapper').style.display = 'none';
    setTimeout(() => {
      Page.getElementById('wrapper').classList.remove('pin_bottom', 'inherit');
      Page.getElementById('brand_header').style.display = 'block';
      Page.getElementById('article_wrapper').style.display = 'none';
      Page.getElementById('article_share').classList.add('share_main');
      Page.getElementById('article_share').style.display = 'block';
      Page.getElementById('back_to_top').classList.add('share_main');
      Page.getElementById('back_to_top').style.display = 'block';
      if (Scroller.scrollTop !== this.lastScrollPos) {
        Scroller.scrollTop = this.lastScrollPos;
      }
    }, 420);
    this.showHubTimeOut = setTimeout(() => {
      //add back after share it integrated
      //Utils.set3dTransform(document.querySelector('.share_button'), 0, 0, 0);
      Page.getElementById('content').classList.remove(
        'animate_fade_to_channels'
      );
      ArticleController.removeArticle();
      Router.canNavigate = true; // set to allow Router to start accepting navigation again
    }, 1000);
  }

  /**
   * Render front page tiles.
   *
   * Note: You can ad as many FrontPage compoenets as you want.
   * Good for when u need tiles and then another element ike a video and then more tiles.
   * @param {Array} articles Array of Article objects.
   * @param {Array} [sortedCollections=[]] Array of cta's
   */
  renderArticles(articles, sortedCollections = []) {
    render(
      <div>
        <CallToAction />
        <FrontPage
          articles={addPromoItems(
            [].concat(articles),
            [].concat(sortedCollections)
          )}
          onRenderedHandler={this.onFrontPageRendered}
        />
        <EndMsg />
        <Footer />
        <ScrollIndicator />
      </div>,
      Page.getElementById('wrapper')
    );
  }
}

export default Microzine;
