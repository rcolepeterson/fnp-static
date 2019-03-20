import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import styled from 'styled-components';
import { fonts } from 'microzine-3.2/styles/designSystem';

const Wrapper = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  height: 44px;
  line-height: 18px;
  font-size: ${fonts.Body};
  margin: 10px 0 0 !important;
  white-space: normal;
`;

class RelatedArticleContent extends Component {
  createMarkUp() {
    return { __html: this.props.content };
  }
  render() {
    return <Wrapper dangerouslySetInnerHTML={this.createMarkUp()} />;
  }
}

export default RelatedArticleContent;
