import React, { Component } from "react"; //eslint-disable-line no-unused-vars
//import Markup from "preact-markup";
//import Zumobivideoyoutube from "microzine-3.2/views/partials/video/Zumobivideoyoutube";
//import Zumobivideobrightcove from 'microzine-3.2/views/partials/video/Zumobivideobrightcove';
//import Zumobivideovideojs from "microzine-3.2/views/partials/video/Zumobivideovideojs";
import styled from "styled-components";
import { fontWeights } from "microzine-3.2/styles/designSystem";

const Wrapper = styled.div`
  position: relative;
  line-height: 20px;
  margin: 0 10px;
  h1,
  h2,
  h3 {
    line-height: 1.2;
  }

  strong {
    font-weight: ${fontWeights.semiBold};
  }
  img {
    height: auto;
    width: 100%;
    padding: 0;
    border-radius: 5px;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.5);
  }
  p {
    margin: 0 0 10px 0;
  }
  iframe {
    width: 100%;
    margin: 20px 0;
  }
`;

const MainContent = ({ content }) => {
  // const handleClick = e => {
  //   //external cliks will open in a new tab , where as relative urls will be opening within MZ
  //   let url = e.target.attributes.href;
  //   if (e.target.attributes.href && url.value) {
  //     let urlVal = e.target.attributes.href.value;
  //     if (urlVal.indexOf("http") === -1 && urlVal.indexOf("https") === -1) {
  //       window.location.hash = "#" + urlVal;
  //       e.preventDefault();
  //     }
  //   }
  // };
  function createMarkup() {
    return { __html: content };
  }

  return (
    <Wrapper>
      <div dangerouslySetInnerHTML={createMarkup()} />
    </Wrapper>
  );
};
export default MainContent;
