import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import ArticleVideo from 'microzine-3.2/views/partials/article/ArticleVideo';
//import InfoPanel from 'microzine-3.2/views/partials/article/InfoPanel';
import Footer from 'microzine-3.2/views/partials/Footer';
import MainContent from 'microzine-3.2/views/partials/article/MainContent';
import ArticleTitle from 'microzine-3.2/views/partials/article/ArticleTitle';

import ArticlePage, {
  Wrapper
} from 'microzine-3.2/views/partials/article/ArticlePage';

class ArticlePageYoutube extends ArticlePage {
  constructor(props) {
    super(props);
  }

  handleImageExpand() {
    return;
  }

  render(props, state) {
    return (
      <Wrapper className={'article card'}>
        <div className="content_wrapper">
          <div className={'content_container card'}>
            <ArticleVideo
              url={props.article.videoUrl}
              image={props.article.articleImage.url}
              source={props.article.source}
              height={state.scaledHeight}
            />
            <ArticleTitle
              title={props.article.articleTitle}
              info={props.article.leftInfo}
              source={props.article.source}
              subTitle={props.article.articleSubTitle}
              collectionIcon={props.article.icon}
              icon={props.article.profileImage}
            />
            <MainContent content={props.article.content} />
          </div>
          {this.endCards}
        </div>
        <Footer data={props.data} />
      </Wrapper>
    );
  }
}

export default ArticlePageYoutube;
