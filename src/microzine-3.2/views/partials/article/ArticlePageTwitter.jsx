import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import ArticleImage from 'microzine-3.2/views/partials/article/ArticleImage';
import InfoPanel from 'microzine-3.2/views/partials/article/InfoPanel';
import Footer from 'microzine-3.2/views/partials/Footer';
import MainContent from 'microzine-3.2/views/partials/article/MainContent';
import ArticleTitle from 'microzine-3.2/views/partials/article/ArticleTitle';

import ArticlePage, {
  Wrapper
} from 'microzine-3.2/views/partials/article/ArticlePage';
import styled from 'styled-components';
import { fonts } from 'microzine-3.2/styles/designSystem';

const TwitterDate = styled.div`
  ${fonts.Info};
  position: relative;
  display: block;
  margin: 10px 10px 0;
`;

class ArticlePageTwitter extends ArticlePage {
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
              info={'@' + props.article.extras.screen_name}
              source={props.article.source}
              collectionIcon={props.article.icon}
              icon={props.article.profileImage}
            />
            <InfoPanel
              leftInfo={props.article.leftInfo}
              rightInfo={props.article.rightInfo}
            />
            <MainContent content={props.article.content} />
            <ArticleImage
              image={props.article.articleImage.url}
              handleImageExpand={this.handleImageExpand.bind(this)}
              class={'prevent_transition'}
              style={{
                height: state.scaledHeight,
                display: state.scaledHeight === 0 ? 'none' : 'block'
              }}
            />
            <TwitterDate>
              {props.article.getFormatedDate('h:mma - D MMM YYYY')}
            </TwitterDate>
          </div>
          {this.endCards}
        </div>
        <Footer data={props.data} />
      </Wrapper>
    );
  }
}

export default ArticlePageTwitter;
