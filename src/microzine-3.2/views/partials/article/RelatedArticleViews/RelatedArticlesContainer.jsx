import React, { Component } from "react"; //eslint-disable-line no-unused-vars
import RelatedArticle from "microzine-3.2/views/partials/article/RelatedArticleViews/RelatedArticle";
import Utils from "microzine-3.2/helpers/MicrozineUtils";
import Properties from "microzine-3.2/helpers/MicrozineProperties";

import styled from "styled-components";
import PropTypes from "prop-types";
import { fonts } from "microzine-3.2/styles/designSystem";

const Wrapper = styled.div`
  background-color: white;
  position: relative;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  font-size: 16px;
  padding-bottom: 20px;
  border-top: 2px solid #e5e5e5;
  .related_header {
    ${fonts.Title};
    font-weight: bold;
    color: #666666;
    position: relative;
    white-space: normal;
    padding: 15px 10px;
    text-transform: capitalize;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    overflow: hidden;
    padding-bottom: 15px;
    .with_watson {
      display: inline-block;
      height: 20px;
      position: absolute;
      padding-left: 5px;
    }
  }
  a:link,
  a:hover,
  a:active,
  a:visited {
    text-decoration: none;
    color: inherit;
  }
`;

class RelatedArticlesContainer extends Component {
  constructor() {
    super();
    this.mappedArticles = [];
    this.randomizedArticles = [];
    this.relatedArticles = [];
  }

  componentWillMount() {
    /*
    finds the article that uses the same digest and uses that to render,
    this provide a location that will always be there as well as more information
    */
    if (Utils.getSafe(() => this.props.relatedArticles.length) !== 0) {
      this.mappedArticles = this.props.relatedArticles.map(relatedArticle => {
        // Legacy support: If there is a title in the JSON ... we want to link to the extranal URL.
        if (relatedArticle.title) {
          relatedArticle.external = true;
        } else {
          relatedArticle.external = false;
          // Go find the matching digest in the current Article Collection.
          let digest = relatedArticle.digest;
          let matchedArticle = Properties.articles.find(article => {
            return article.article_digest === digest;
          });
          /* @Tricky: Setting the relatedArticle link below. If NO associated collection name, we must be displaying an older 
                      Article that is not in the current Article Collection. 
                      Use the clean title and let the Router go find it in the external folder ... on click.
          */
          relatedArticle.link = matchedArticle
            ? `${matchedArticle.article_collection_name}/${
                matchedArticle.article_clean_title
              }`
            : relatedArticle.clean_title;
        }

        return relatedArticle;
      });

      while (
        this.mappedArticles.length &&
        this.randomizedArticles.length !== 2
      ) {
        let rand = ~~(Math.random() * this.mappedArticles.length);
        this.randomizedArticles.push(this.mappedArticles.splice(rand, 1)[0]);
        if (this.mappedArticles.length < 1) {
          break;
        }
      }
    }
    this.relatedArticles = this.randomizedArticles.map((randomArticle, i) => {
      let title = randomArticle.article_title
        ? randomArticle.article_title
        : randomArticle.title;

      return (
        <RelatedArticle
          thumbnail={randomArticle.thumbnail ? randomArticle.thumbnail : ""}
          title={title || ""}
          url={randomArticle.url}
          mzLink={randomArticle.link}
          external={randomArticle.external}
          key={i}
          isSingle={this.randomizedArticles.length === 1}
        />
      );
    });
  }

  render() {
    return (
      <Wrapper className="related_article_container card">
        <div className="related_header">
          Related Articles
          {this.props.withWatson && (
            <svg className="with_watson" viewBox="0 0 66 25">
              <path
                fill="#666666"
                d="M21,24h-2.3l-1.8-6.5h0L15.1,24h-2.4l-2.8-9.6h2.3L14,21h0l1.8-6.5H18l1.8,6.6h0l1.7-6.6h2.3L21,24z M23.9,19.2
            c0.1-1.8,1.9-2.3,3.6-2.3c1.5,0,3.4,0.3,3.4,2v3.6c0,0.5,0.1,1.1,0.3,1.5H29c-0.1-0.2-0.1-0.4-0.1-0.7c-0.7,0.6-1.6,0.9-2.6,0.9
            c-1.5,0-2.6-0.7-2.6-2.1c0-3.2,5.2-1.5,5.1-3c0-0.8-0.6-0.9-1.4-0.9c-0.8,0-1.3,0.3-1.4,1L23.9,19.2z M28.8,20.6
            C28.2,20.9,27.6,21,27,21c-0.7,0.1-1.3,0.3-1.3,1s0.6,0.9,1.3,0.9c1.7,0,1.7-1.2,1.7-1.6L28.8,20.6z M35,17.1h1.5v1.3H35v3.4
            c0,0.6,0.2,0.8,0.9,0.8c0.2,0,0.4,0,0.7-0.1V24c-0.4,0.1-0.8,0.1-1.2,0.1c-1.3,0-2.4-0.3-2.4-1.7v-4.1h-1.3v-1.3h1.3V15H35L35,17.1z
              M39.2,21.8c0,0.8,0.8,1.2,1.6,1.2c0.6,0,1.4-0.2,1.4-0.9c0-0.6-0.9-0.8-2.4-1.1c-1.2-0.3-2.4-0.6-2.4-1.9c0-1.8,1.7-2.2,3.3-2.2
            s3.2,0.5,3.4,2.2h-2c-0.1-0.7-0.7-0.9-1.4-0.9c-0.5,0-1.2,0.1-1.2,0.6c0,0.7,1.2,0.8,2.4,1c1.2,0.3,2.4,0.7,2.4,1.9
            c0,1.8-1.8,2.4-3.5,2.4c-1.8,0-3.5-0.6-3.6-2.4H39.2z M49,16.9c2.4,0,4,1.5,4,3.7s-1.6,3.7-4,3.7s-4-1.5-4-3.7S46.6,16.9,49,16.9z
              M49,22.8c1.4,0,1.9-1.1,1.9-2.2s-0.4-2.2-1.9-2.2s-1.9,1.1-1.9,2.2S47.6,22.8,49,22.8L49,22.8z M54,17.1h2v1h0
            c0.5-0.8,1.4-1.2,2.4-1.2c2.2,0,2.8,1.1,2.8,2.9V24h-2.1v-3.9c0-1.1-0.4-1.7-1.4-1.7c-1.1,0-1.6,0.6-1.6,2V24H54L54,17.1z
              M62.9,15.7h-0.5v1.4h-0.3v-1.3h-0.5v-0.2h1.4V15.7z M65.1,17.1h-0.3v-1.3h0l-0.6,1.3h-0.2l-0.6-1.3h0v1.3h-0.3v-1.6h0.4l0.5,1.2
            l0.5-1.2h0.4L65.1,17.1z M2.2,24V1c0-0.6-0.5-1-1.1-1C0.5,0,0,0.4,0,1v23c0,0.6,0.5,1,1.1,1C1.7,25,2.2,24.6,2.2,24z M26.7,1h-2.1
            v1.6h2.1L26.7,1z M23.9,1h-2.3l-1.7,6.6h0L18,1h-2.2L14,7.5h0L12.3,1H9.9l2.8,9.6h2.4l1.8-6.5h0l1.8,6.5H21L23.9,1z M24.5,10.6h2.1
            V3.7h-2.1V10.6z M30.8,1.6h-2.1v2.1h-1.3v1.3h1.3V9c0,1.4,1.1,1.7,2.4,1.7c0.4,0,0.8,0,1.2-0.1V9.1c-0.2,0-0.4,0.1-0.7,0.1
            c-0.7,0-0.9-0.2-0.9-0.8V4.9h1.5V3.7h-1.5L30.8,1.6z M33.5,10.6h2.1V7c0-1.4,0.5-2,1.6-2c1,0,1.4,0.6,1.4,1.7v3.9h2.1V6.3
            c0-1.7-0.6-2.9-2.8-2.9c-0.9,0-1.7,0.4-2.2,1.2h0V1h-2.1V10.6z"
              />
            </svg>
          )}
        </div>
        {this.relatedArticles}
      </Wrapper>
    );
  }
}

RelatedArticlesContainer.propTypes = {
  relatedArticles: PropTypes.array.isRequired,
  withWatson: PropTypes.bool
};

export default RelatedArticlesContainer;
