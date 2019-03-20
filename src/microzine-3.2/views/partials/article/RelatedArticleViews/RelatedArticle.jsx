import React from 'react'; //eslint-disable-line no-unused-vars

import RelatedArticleImage from 'microzine-3.2/views/partials/article/RelatedArticleViews/RelatedArticleImage';
import RelatedArticleContent from 'microzine-3.2/views/partials/article/RelatedArticleViews/RelatedArticleContent';
import MicrozineEvents from 'microzine-3.2/helpers/MicrozineEvents';
import Router from 'microzine-3.2/api/Router';
import ArrowButton from 'microzine-3.2/views/partials/buttons/ArrowButton';
import { media, breakpoints } from 'microzine-3.2/styles/designSystem';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const RelatedArticle = ({
  mzLink,
  thumbnail,
  title,
  url,
  external = false,
  isSingle = false
}) => {
  const handleClick = () => {
    Router.setRoute(`${mzLink}`);

    MicrozineEvents.dispatchEvent('relateditemclicked', {
      title,
      url
    });
  };
  const wrapperClassName = isSingle
    ? 'related_article single'
    : 'related_article';

  return (
    <Wrapper
      className={wrapperClassName}
      href={external ? url : undefined}
      target={external ? '_blank' : undefined}
      onClick={handleClick}>
      <RelatedArticleImage image={thumbnail} />
      <span className="overlay" />
      <RelatedArticleContent content={title} />
      <ArrowButtonWrapper />
    </Wrapper>
  );
};

RelatedArticle.propTypes = {
  thumbnail: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string,
  external: PropTypes.bool.isRequired,
  isSingle: PropTypes.bool
};

const ArrowButtonWrapper = styled(ArrowButton)`
  float: right;
`;

const Wrapper = styled.a`
  position: relative;
  display: block;
  margin: 20px 20px 0 20px;
  padding-bottom: 35px;
  background-color: #ffffff;
  overflow: hidden;
  text-decoration: none;
  cursor: pointer;

  &.empty_related_article {
    height: calc(50px + (100vw - 60px) / 2 * 9 / 16);
    background-color: $light-grey;
    width: calc(100% - 40px);
    cursor: inherit;
    box-shadow: none;
  }
  .overlay {
    height: calc((100vw - 40px) * 9 / 16);
    border-radius: 5px 5px 0 0;
  }

  ${media.smallUp`
      width: calc(50% - 40px);
      display: inline-block;
      &.single {
        width: calc(100% - 40px);
      }
  `};

  ${media.xsmallUp`
      width: calc(50% - 15px);
      display: inline-block;
      vertical-align: top;
      margin: 0 0 0 10px;
      .overlay {
        height: calc((100vw - 60px)/2 * 9/16);
      }
      &.empty_related_article {
        max-width: calc(50% - 15px);
      }
      &.single {
        width: calc(100% - 20px);
      }
  `};
  ${media.xsmall`
      &.empty_related_article {
        display: none;
      }
  `};
  ${media.mediumUp`
      .overlay {
        height: calc((${breakpoints.medium}px - 60px)/2 * 9/16);
      }
      &.empty_related_article {
      height: calc(50px + (${breakpoints.medium}px - 60px)/2 * 9/16);
      }
      
  `};
`;

export default RelatedArticle;
