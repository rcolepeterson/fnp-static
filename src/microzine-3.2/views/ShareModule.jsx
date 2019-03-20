import React, { Component } from "react"; //eslint-disable-line no-unused-vars
import Router from "microzine-3.2/api/Router";
import MicrozineEvents from "microzine-3.2/helpers/MicrozineEvents";
import Properties from "microzine-3.2/helpers/MicrozineProperties";
import Page from "microzine-3.2/api/Page";
import Logger from "microzine-3.2/helpers/Logger";
import { colors, animation } from "microzine-3.2/styles/designSystem";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 12;
  background-color: rgba(0, 0, 0, 0.85);
  display: none;
  animation: ${animation.fadeout} 0.7s;
  animation-fill-mode: forwards;

  .sharing & {
    animation: ${animation.fadein} 0.7s;
    animation-fill-mode: forwards;
  }
`;

const ShareLinks = styled.div`
  width: 120px;
  height: 170px;
  background-color: white;
  top: -190px;
  left: -80px;
  position: absolute;
  padding: 5px 0;
  display: none;
  animation: ${animation.slideout} 0.7s;
  animation-fill-mode: forwards;
  a {
    font-size: 14px;
    background-repeat: no-repeat;
    width: calc(100% -40px);
    display: block;
    height: 40px;
    border: none;
    cursor: pointer;
    outline: none;
    padding: 10px 0 0 40px;
    color: white;
    text-decoration: none;
  }
  .triangle {
    height: 0px;
    width: 0px;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-top: 15px solid #fff;
    margin-left: auto;
    margin-right: 6px;
  }
  .sharing & {
    animation: ${animation.slidein} 0.7s;
    animation-fill-mode: forwards;
  }
`;

const ShareButton = styled.div`
  position: fixed;
  height: 40px;
  width: 40px;
  border-radius: 5px;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  z-index: 13;
  padding: 0;
  border: 0;
  outline: none;
  opacity: 1;
  transition-property: opacity;
  transition-duration: 250ms;
  transition-timing-function: ease-out;
  transition-delay: 500ms;

  #copy_btn {
    background-color: #7f7f7f;
    background-size: 27px;
    background-position: 7px 6px;
  }
  #facebook_btn {
    background-color: #3c5b9b;
  }
  #twitter_btn {
    background-color: #2daae1;
  }
  #mail_btn {
    background-color: ${colors.brand};
  }

  #share_toggle {
    transition: transform 0.2s ease-out;
    transform: translate3d(0, 0, 0);
    background-color: #4a4a4a;
    background-repeat: no-repeat;
    background-position: center;
    width: calc(100% -40px);
    display: block;
    height: 40px;
    border: none;
    cursor: pointer;
    outline: none;
    padding: 0 0 0 40px;
  }
  &.show {
    opacity: 1;
  }

  [data-mode="interstitial"] & {
    bottom: 60px;
  }
  .share_main & {
    [data-mode="interstitial"] & {
      bottom: 20px;
    }
  }
`;

class ShareModule extends Component {
  constructor() {
    super();

    this.state = {
      expanded: false,
      isVisible: false,
      shareStyle: {
        backgroundImage: `url(${Properties.assetPath}/share.svg)`
      }
    };

    Page.addEventListener("resize", this.handleResize.bind(this));
    this.moving = false;
    this.article = null;
    this.fixedButtonRange = 15 / 20;
    this.timeout = null;
    this.expandedTimeout = null;
  }

  _handlePageVisibilityChange() {
    let shareLinks = this.shareButton.querySelector(".share_links");
    let overlay = this.overlay;
    shareLinks.style.display = "none";
    overlay.style.display = "none";
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.expandedTimeout) {
      clearTimeout(this.expandedTimeout);
    }
  }
  componentDidMount() {
    // @cpeterson - removed event listenrs to get demo working. @todo - fix.
    MicrozineEvents.addEventListener("microzineready", () => {
      this.setState({ isVisible: true, expanded:false });
    });
    // if (typeof document.hidden !== "undefined") {
    //   this.visibilityState = "hidden";
    //   document.addEventListener(
    //     "visibilitychange",
    //     this._handlePageVisibilityChange.bind(this)
    //   );
    // } else if (typeof document.mozHidden !== "undefined") {
    //   this.visibilityState = "mozHidden";
    //   document.addEventListener(
    //     "mozvisibilitychange",
    //     this._handlePageVisibilityChange.bind(this)
    //   );
    // } else if (typeof document.msHidden !== "undefined") {
    //   this.visibilityState = "msHidden";
    //   document.addEventListener(
    //     "msvisibilitychange",
    //     this._handlePageVisibilityChange.bind(this)
    //   );
    // } else if (typeof document.webkitHidden !== "undefined") {
    //   this.visibilityState = "webkitHidden";
    //   document.addEventListener(
    //     "webkitvisibilitychange",
    //     this._handlePageVisibilityChange.bind(this)
    //   );
    // }
    // Router.addEventListener("routechange", this.handleRouteChange.bind(this));
  }
  componentWillUnmount() {
     MicrozineEvents.removeEventListener("microzineready", () => {
      this.setState({ isVisible: true, expanded:false });
    });
    Page.removeEventListener("resize", this.handleResize.bind(this));
  }
  
  handleRouteChange({ article }) {
    //close if route change happens
    if (this.state.expanded) {
      this.handleToggleClick();
    }
    if (article) {
      this.article = document.querySelector(".article");
    } else {
      this.article = null;
      this.articleHeight = 0;
    }
  }
  handleResize() {
    setTimeout(() => {
      if (this.article) {
        this.articleHeight = this.article.offsetHeight - Page.height;
      }
    }, 500);
    // handle bottom scroll:
    // setTimeout(() => {
    //   this.handleScroll({scrollTop:window.pageYOffset});
    // },1000);
  }

  handleToggleClick(evt) {
    let shareLinks = this.shareButton.querySelector(".share_links");
    let overlay = this.overlay;
    //turn off display none so css animation can handle the rest.
    //these need display none so their animations don't show on load.
    if (this.state.expanded) {
      this.setState({
        expanded: false,
        shareStyle: {
          backgroundImage: `url(${Properties.assetPath}/share.svg)`
        }
      });
      Page.getElementById("article_share").classList.remove("sharing");
      clearTimeout(this.expandedTimeout);
      this.timeout = setTimeout(() => {
        shareLinks.style.display = "none";
        overlay.style.display = "none";
      }, 800);
    } else {
      clearTimeout(this.timeout);
      this.expandedTimeout = setTimeout(() => {
        shareLinks.style.display = "block";
        overlay.style.display = "block";
      }, 100);
      //  window.setTimeout(() => {
      Page.getElementById("article_share").classList.add("sharing");
      //  },0);
      this.setState({
        expanded: true,
        shareStyle: {
          backgroundImage: `url(${Properties.assetPath}/close.svg)`
        }
      });
    }
  }

  /**
 * handle moving up the share module when you reach the bottom.
 * 
 * @param {number} scrollTop basically scrollY (or pageYOffset) 
 * @memberof ShareModule
 
handleScroll({scrollTop}){
    if(this.article && !this.articleHeight){
      if(scrollTop !== 0){
        this.articleHeight = this.article.offsetHeight - Page.height;
      }else{
        this.articleHeight = 0;
      }
    } 
    if(scrollTop >= this.articleHeight && !Properties.isInterstitial){
      this.moving = true;
      let movement = this.articleHeight - scrollTop;
      //don't allow movement past -50
      if(movement < -50){movement = -50;}
      Utils.set3dTransform(this.shareButton, 0, this.fixedButtonRange*movement, 0);
    }else if(this.moving){
      Utils.set3dTransform(this.shareButton, 0, 0, 0);
      this.moving = false;
    }
  }
  */

  /**
   *  Copies the current URL to the user's clipboard if it's available
   *
   * @memberof ShareModule
   * @returns {void}
   */
  copyToClipboard() {
    let baseUrl = Properties.isFriendlyIframe
      ? `${document.getElementsByTagName("base")[0].href}${Properties.brand}/${
          Properties.entryPage
        }.html`
      : Router.baseUrl;
    let URL = !Router.currentRoute
      ? `${baseUrl}`
      : `${baseUrl}#${Router.currentRoute.route.join("/")}`;

    if (window.clipboardData && window.clipboardData.setData) {
      // IE specific code path to prevent textarea being shown while dialog is visible.
      return window.clipboardData.setData("Text", URL);
    } else if (
      document.queryCommandSupported &&
      document.queryCommandSupported("copy")
    ) {
      let textarea = document.createElement("textarea");
      textarea.textContent = URL;
      textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
      document.body.appendChild(textarea);
      textarea.select();
      try {
        return document.execCommand("copy"); // Security exception may be thrown by some browsers.
      } catch (ex) {
        Logger.warn("Copy to clipboard failed.", ex);
        return false;
      } finally {
        document.body.removeChild(textarea);
      }
    } else {
      Logger.warn("Copy to clipboard failed.");
    }
  }
  render() {
    let isVisible = this.state.isVisible ? "show" : "";
    return (
      <div id="article_share">
        <Overlay
          className="overlay"
          onClick={this.handleToggleClick.bind(this)}
          ref={node => (this.overlay = node)}
        />
        <ShareButton
          className={"share_button " + isVisible}
          ref={node => (this.shareButton = node)}
        >
          <div
            id="share_toggle"
            style={this.state.shareStyle}
            onClick={this.handleToggleClick.bind(this)}
          />
          <ShareLinks
            className="share_links"
            onClick={this.handleToggleClick.bind(this)}
          >
            <div
              onClick={this.copyToClipboard}
              id="copy_btn"
              style={{
                backgroundImage: `url(${Properties.assetPath}/link.svg)`
              }}
            >
              Copy Link
            </div>
            <a
              target="_blank"
              data-sharing-api="facebook"
              id="facebook_btn"
              style={{
                backgroundImage: `url(${Properties.assetPath}/facebook.svg)`
              }}
            >
              Share
            </a>
            <a
              target="_blank"
              data-sharing-api="twitter"
              id="twitter_btn"
              style={{
                backgroundImage: `url(${Properties.assetPath}/twitter.svg)`
              }}
            >
              Tweet
            </a>
            <a
              id="mail_btn"
              data-sharing-api="mailto"
              style={{
                backgroundImage: `url(${Properties.assetPath}/email.svg)`
              }}
            >
              Email
            </a>
            <div className="triangle" />
          </ShareLinks>
        </ShareButton>
      </div>
    );
  }
}

export default ShareModule;
