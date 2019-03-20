import React, { render } from 'react'; //eslint-disable-line no-unused-vars
import Articles from 'microzine-3.2/api/Articles';
//import Logger from 'microzine-3.2/helpers/Logger';
import MicrozineEvents from 'microzine-3.2/helpers/MicrozineEvents';
import Properties from 'microzine-3.2/helpers/MicrozineProperties';
import Page from 'microzine-3.2/api/Page';
import ArticleController from 'microzine-3.2/controllers/ArticleController';
import Router from 'microzine-3.2/api/Router';
import Scroller from 'microzine-3.2/api/Scroller';
import ShareModule from 'microzine-3.2/views/ShareModule';
import BackToTop from 'microzine-3.2/views/BackToTop';
//import SharingManager from 'microzine-3.2/helpers/SharingManager';
import FrontPageGroups from 'microzine-3.2/views/FrontPageViews/FrontPageGroups';
import Microzine from 'microzine-3.2/controllers/Microzine';

/**
 * Main Microzine controller
 *
 * @version 1.0
 */
class MicrozineGroups extends Microzine {
  /**
   * Creates a new instance of the Microzine controller
   */
  constructor() {
    super();
  }

  init() {
    Scroller.addEventListener('mainPageScroll', this.handleScroll.bind(this));
    MicrozineEvents.addEventListener(
      'loadnextcollection',
      this.debounce(this.loadNextCollection, 1000).bind(this)
    );

    MicrozineEvents.addEventListener('userprofileloaded', () => {
      // The Rails back end doesn't support querying for articles yet, so we still have to
      // support the old way (loading via JSON) for now. We also need to do that to keep supporting SDK v1.3 as well
      // (not sure if that still needs to happen or not).
      // TODO: this is still a mess; once the above is resolved then we still need to make it so this uses the appropriate API call

      if (Properties.groupsLoadByCollection) {
        this.initialGetArticlesCollections();
      } else {
        this.getArticles();
      }
    });
    Router.addEventListener('routechange', this.handleRouteChange.bind(this));
  }

  getStaticCollections() {
    return Articles.loadStaticCollections(Properties.basePath).then(
      staticCollections => {
        staticCollections.forEach(collection => {
          Properties.staticCollections = collection.length
            ? this.sortStaticArticles(collection)
            : [];
        });
      }
    );
  }

  debounce(func, wait, immediate) {
    let timeout;
    return () => {
      let context = this,
        args = arguments;
      let later = () => {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  }

  initialGetArticlesCollections() {
    Promise.all([
      Articles.loadNextVisibleCollection(Properties.basePath),
      this.getStaticCollections()
    ]).then(([articles]) => {
      this.pureArticles = [].concat(articles);
      Properties.articles = [].concat(Properties.articles).concat(articles);

      this.renderArticles();

      // hide loader and display elements
      if (document.querySelector('.loader')) {
        document.querySelector('.loader').style.display = 'none';
      }
      render(<ShareModule />, Page.getElementById('article_share'));
      render(<BackToTop />, Page.getElementById('back_to_top'));

      MicrozineEvents.dispatchEvent('microzineready');
    });
  }

  getArticles() {
    this.getStaticCollections();
    Articles.getAllArticlesFromJson(Properties.basePath).then(results => {
      let articles = results[0],
        staticCollections = results[1];

      Properties.articles = [].concat(Properties.articles).concat(articles);
      Properties.staticArticles = staticCollections;
      this.renderArticles();
      document.querySelector('.loader').style.display = 'none';
      render(<ShareModule />, Page.getElementById('article_share'));
      render(<BackToTop />, Page.getElementById('back_to_top'));
      MicrozineEvents.dispatchEvent('microzineready');
    });
  }

  loadNextCollection() {
    Articles.loadNextVisibleCollection(Properties.basePath)
      .then(articles => {
        Properties.articles = [].concat(Properties.articles).concat(articles);
        MicrozineEvents.dispatchEvent('nextcollectionloaded');
      })
      .catch(() => {
        // ran out of articles to load!
        MicrozineEvents.dispatchEvent('allcollectionsloaded');
      });
  }

  renderArticles() {
    Page.getElementById('wrapper').classList.add('groups');
    this.FrontPageElem = render(
      <FrontPageGroups ref={e => (this.FrontPageGroupNode = e)} />,
      Page.getElementById('wrapper')
    );
  }

  showHub() {
    if (this.getArticleTimeOut) {
      clearTimeout(this.getArticleTimeOut);
    }

    if (this.showHubTimeOut) {
      clearTimeout(this.showHubTimeOut);
    }

    this.FrontPageGroupNode.handleResize();
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
}

export default MicrozineGroups;
