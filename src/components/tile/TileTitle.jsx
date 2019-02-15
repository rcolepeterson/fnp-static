import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { fonts } from '../../styles/designSystem';

const Title = styled.div`
  line-height: 21px;
  /* -webkit-line-clamp doesn't work in ie and firefox so we have a max-height for overflowing text */
  max-height: ${props => (props.isStatic ? 'initial' : '48px')};
  padding-bottom: 0;
  margin-bottom: 10px;
  overflow: hidden;
  div {
    transition: transform 1s ease-out;
    position: relative;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
    text-align: left;
    line-height: 20px;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: ${props => (props.isStatic ? 'initial' : 2)};
    display: -webkit-box;
    ${fonts.Body};
  }
`;

/**
 * Microzine front-page TileTitle component
 */
const TileTitle = ({ isStatic = false, article }) => {

  return (
    <Title static={isStatic}>
      <div dangerouslySetInnerHTML={{ __html: article.article_title }} />
    </Title>
  );
}

TileTitle.propTypes = {
  static: PropTypes.bool,
  article: PropTypes.object.isRequired
};

export default TileTitle;
