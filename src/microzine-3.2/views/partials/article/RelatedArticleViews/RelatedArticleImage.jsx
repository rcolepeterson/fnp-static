import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import styled from 'styled-components';
import { media, breakpoints, colors } from 'microzine-3.2/styles/designSystem';

const Wrapper = styled.div`
  height: calc((100vw - 40px) / 2 * 9 / 16);
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: ${colors.brand};
  ${media.mediumUp`
    height: calc((${breakpoints.medium}px - 60px)/2 * 9/16);
  `};
`;

const RelatedArticleImage = ({ image }) => {
  return (
    <Wrapper style={image ? { backgroundImage: 'url(' + image + ')' } : null} />
  );
};

export default RelatedArticleImage;
