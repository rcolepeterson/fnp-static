import React, { render } from 'react'; //eslint-disable-line no-unused-vars
import Eventifier from 'microzine-3.2/base/Eventifier';
//import Logger from 'microzine-3.2/helpers/Logger';
import Scroller from 'microzine-3.2/api/Scroller';
import Page from 'microzine-3.2/api/Page';
import ArticlePageBlog from 'microzine-3.2/views/partials/article/ArticlePageBlog';
import ArticlePageFacebook from 'microzine-3.2/views/partials/article/ArticlePageFacebook';
import ArticlePageTwitter from 'microzine-3.2/views/partials/article/ArticlePageTwitter';
import ArticlePageInstagram from 'microzine-3.2/views/partials/article/ArticlePageInstagram';
import ArticlePageYoutube from 'microzine-3.2/views/partials/article/ArticlePageYoutube';
import ArticleClose from 'microzine-3.2/views/partials/article/ArticleClose';

let _articles = [];

class ArticleController extends Eventifier {
  constructor() {
    super();
    this.articleClose = Page.getElementById('article_close_wrapper');
    this.articleWrapper = Page.getElementById('article_wrapper');
  }
  get articles() {
    return _articles;
  }
  set articles(articles) {
    _articles = articles;
  }
  renderArticle(article) {
    this.removeArticle();
    //[TODO] detect and ignore android as well
    this.articleCloseElem = render(
      <ArticleClose source={article.article_extras.source} />,
      this.articleClose
    );
    switch (article.source) {
      case 'blog':
        this.articlePageElem = render(
          <ArticlePageBlog article={article} />,
          this.articleWrapper
        );
        break;
      case 'facebook':
        this.articlePageElem = render(
          <ArticlePageFacebook article={article} />,
          this.articleWrapper
        );
        break;
      case 'twitter':
        this.articlePageElem = render(
          <ArticlePageTwitter article={article} />,
          this.articleWrapper
        );
        break;
      case 'instagram':
        this.articlePageElem = render(
          <ArticlePageInstagram article={article} />,
          this.articleWrapper
        );
        break;
      case 'youtube':
        this.articlePageElem = render(
          <ArticlePageYoutube article={article} />,
          this.articleWrapper
        );
        break;
      default:
        this.articlePageElem = render(
          <ArticlePageBlog article={article} />,
          this.articleWrapper
        );
        break;
    }
    Scroller.articleVisibility = true;

    this.dispatchEvent('articlerendered', {
      article: article
    });

    //Logger.log('Showing article', article);
  }
  /**
   * preact doesn't support unmount so here is hack to do it. https://github.com/developit/preact/issues/53
   *
   * @returns {void}
   */
  removeArticle() {
    render('', this.articleClose, this.articleCloseElem);
    render('', this.articleWrapper, this.articlePageElem);
    Scroller.articleVisibility = false;
    this.dispatchEvent('articleremoved', {});
    //Logger.log('Removing article');
  }
}

export default new ArticleController();
