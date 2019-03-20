import React, { Component } from "react"; //eslint-disable-line no-unused-vars
//import Router from "microzine-3.2/api/Router";
import Properties from "microzine-3.2/helpers/MicrozineProperties";
import styled from "styled-components";
import { colors, fontWeights } from "microzine-3.2/styles/designSystem";
import { Link } from "gatsby";

class ArticleClose extends Component {
  componentDidMount() {
    this.closed = false;
  }

  handleNavigateBack(e) {
    e.stopPropagation();
    if (this.closed) {
      return;
    }
    this.closed = true;
    //Router.navigateToHub();
  }

  render(props) {
    if (Properties.isInterstitial) {
      return (
        <CloseInterstitial id="article_close">
          <Link to="/articles">
            <div>
              <span>Back To Home Screen</span>
              <svg x="0px" y="0px" viewBox="0 0 14 23">
                <path
                  id="arrow-copy"
                  fill="#FFFFFF"
                  d="M0.7,22.3c-0.5-0.5-0.6-1.2-0.2-1.6l9.3-8.8l-9.3-9C0.1,2.4,0.2,1.7,0.7,1.2S2,0.6,2.4,1
                l11.3,10.9c0,0,0,0,0,0l0,0L2.4,22.5C2,22.9,1.3,22.8,0.7,22.3"
                />
              </svg>
            </div>
          </Link>
        </CloseInterstitial>
      );
    }
    let targetClass = "target";
    if (Properties.platform === "Android" && props.source === "youtube") {
      targetClass = "android_target";
    }
    return (
      <Close
        id="article_close"
        style={{ backgroundImage: `url(${Properties.assetPath}/close.svg)` }}
      >
        <div
          className={targetClass}
          onClick={this.handleNavigateBack.bind(this)}
        />
      </Close>
    );
  }
}

export default ArticleClose;

const Close = styled.div`
  position: fixed;
  top: 0;
  height: 40px;
  left: 0;
  width: 40px;
  cursor: pointer;
  z-index: 11;
  transform: translate3d(0, 0, 0);
  background-color: transparent;
  right: 0px;
  .target {
    width: 40px;
    left: 0;
    height: 40px;
    position: relative;
  }
  .android_target {
    width: 70px;
    left: -15px;
    height: 60px;
    position: relative;
  }
  svg {
    position: relative;
    width: 24px;
    top: 8px;
    left: 8px;
  }
`;

const CloseInterstitial = styled(Close)`
  height: 40px;
  top: inherit;
  bottom: 0;
  right: inherit;
  transform: translate3d(0, 0, 0);
  width: 100%;
  background-color: ${colors.brand};
  color: #ffffff;
  text-transform: uppercase;
  font-size: 12px;
  span {
    line-height: 40px;
    position: absolute;
    right: 20px;
    font-weight: ${fontWeights.semiBold};
    font-size: 14px;
    letter-spacing: 1px;
    color: white;
  }
  svg {
    position: absolute;
    width: 12px;
    top: 10px;
    transform: rotate(180deg);
    left: 20px;
    text-align: left;
  }
`;
