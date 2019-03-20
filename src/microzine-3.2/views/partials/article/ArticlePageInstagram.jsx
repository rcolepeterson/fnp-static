import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import ArticleImage from 'microzine-3.2/views/partials/article/ArticleImage';
import InfoPanel from 'microzine-3.2/views/partials/article/InfoPanel';
import Footer from 'microzine-3.2/views/partials/Footer';
import MainContent from 'microzine-3.2/views/partials/article/MainContent';
import ArticleTitle from 'microzine-3.2/views/partials/article/ArticleTitle';

import ArticlePage, {
  Wrapper
} from 'microzine-3.2/views/partials/article/ArticlePage';

class ArticlePageInstagram extends ArticlePage {
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
            <ArticleTitle
              source={props.article.source}
              collectionIcon={props.article.icon}
              icon={props.article.profileImage}
            />
            <ArticleImage
              image={props.article.articleImage.url}
              handleImageExpand={this.handleImageExpand.bind(this)}
              class={'expanded prevent_transition'}
              style={{ height: state.scaledHeight }}
            />
            <InfoPanel
              leftInfo={props.article.leftInfo}
              rightInfo={props.article.rightInfo}
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

export default ArticlePageInstagram;
