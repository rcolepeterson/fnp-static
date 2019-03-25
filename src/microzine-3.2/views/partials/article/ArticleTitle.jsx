import React, { Component } from "react"; //eslint-disable-line no-unused-vars
import Properties from "microzine-3.2/helpers/MicrozineProperties";
import PropTypes from "prop-types";
import styled from "styled-components";
import { fonts } from "microzine-3.2/styles/designSystem";

const ArticleTitle = props => {
  let noBrandIcon = "";
  let socialIcon = "";
  props.icon
    ? (socialIcon = <img src={props.icon} alt="" />)
    : (noBrandIcon = "no_brand_icon");
  return (
    <Wrapper className={props.source + " " + noBrandIcon}>
      {socialIcon}
      <div>
        <span>{Properties.brandName}</span>
        {props.info && <span className="sub_head">{props.info}</span>}
      </div>
      {props.collectionIcon && (
        <SourceIcon
          style={{ backgroundImage: "url(" + props.collectionIcon + ")" }}
        />
      )}
      {props.title && <SubTitle>{props.title}</SubTitle>}
    </Wrapper>
  );
};

const SubTitle = styled.span`
  display: block;
  padding: 15px 0 0 0;
`;

const SourceIcon = styled.span`
  width: 25px;
  height: 25px;
  position: absolute;
  background-size: cover;
  right: 0px;

  .instagram & {
    background: url(./instagram.svg) no-repeat left top,
      radial-gradient(
        circle farthest-corner at 35% 90%,
        #fec564,
        transparent 50%
      ),
      radial-gradient(
        circle farthest-corner at 0 140%,
        #fec564,
        transparent 50%
      ),
      radial-gradient(
        ellipse farthest-corner at 0 -25%,
        #5258cf,
        transparent 50%
      ),
      radial-gradient(
        ellipse farthest-corner at 20% -50%,
        #5258cf,
        transparent 50%
      ),
      radial-gradient(
        ellipse farthest-corner at 100% 0,
        #893dc2,
        transparent 50%
      ),
      radial-gradient(
        ellipse farthest-corner at 60% -20%,
        #893dc2,
        transparent 50%
      ),
      radial-gradient(
        ellipse farthest-corner at 100% 100%,
        #d9317a,
        transparent
      ),
      linear-gradient(
        #6559ca,
        #bc318f 30%,
        #e33f5f 50%,
        #f77638 70%,
        #fec66d 100%
      ) !important;
    height: 26px;
    width: 26px;
  }
  .blog & {
    background-color: #f7a700;
  }
  .cms & {
    background-color: #f7a700;
  }
  .youtube & {
    background-color: #fe3432;
  }
  .twitter & {
    background-color: #2daae1;
  }
  .facebook & {
    background-color: #3c5b9b;
  }
`;

const Wrapper = styled.div`
  ${fonts.Title};
  z-index: 2;
  position: relative;
  font-size: 16px;
  line-height: 24px;
  margin: 10px 10px;
  div {
    padding-left: 10px;
    display: inline-block;
    vertical-align: middle;
    width: calc(100% - 85px);
    span {
      line-height: 1;
      display: block;
      &.sub_head {
        ${fonts.Info};
        line-height: 1;
        text-transform: initial;
        padding-top: 3px;
        padding-bottom: 2px;
      }
    }
  }
  img {
    max-height: 40px;
    max-width: 40px;
    vertical-align: middle;
  }
  &.blog div {
    max-width: calc(100% - 78px);
  }

  &.no_brand_icon div {
    padding-left: 0px;
  }
`;

ArticleTitle.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  collectionIcon: PropTypes.string,
  info: PropTypes.string
};

export default ArticleTitle;
