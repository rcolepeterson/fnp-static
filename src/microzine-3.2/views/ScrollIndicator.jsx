import React, { Component } from "react"; //eslint-disable-line no-unused-vars
import MicrozineEvents from "microzine-3.2/helpers/MicrozineEvents";
//import Router from "microzine-3.2/api/Router";
import Scroller from "microzine-3.2/api/Scroller";
import { media } from "microzine-3.2/styles/designSystem";
import Properties from "microzine-3.2/helpers/MicrozineProperties";
import styled from "styled-components";

const Wrapper = styled.div`
  font-size: 14px;
  position: fixed;
  -ms-touch-action: none;
  touch-action: none;
  left: 20px;
  bottom: 20px;
  width: calc(100% - 90px);
  height: 0;
  opacity: 0;
  background: rgba(50, 50, 50, 0.9);
  color: white;
  line-height: 40px;
  text-transform: uppercase;
  text-align: center;
  z-index: 9;
  transition-property: opacity, height;
  transition-duration: 250ms, 0ms;
  transition-timing-function: ease-out;
  transition-delay: 0ms, 250ms;
  &.show {
    opacity: 1;
    height: 40px;
    transition-delay: 500ms;
  }
  &:before,
  &:after {
    content: "";
    display: block;
    width: 18px;
    height: 20px;
    left: 15px;
    position: absolute;
    top: 10px;
    background: url(${Properties.assetPath}/lgArrow.svg) no-repeat center center;
    transform: rotate(90deg);
    background-size: contain;
  }
  &:after {
    right: 15px;
    left: auto;
  }

  ${media.mediumUp`
    font-size: unset;
  `};

  ${media.largeUp`
    width: 936px;
    left: calc((100% - 990px) / 2 + 0px);
  `};
`;

/**
 * ScrollIndicator
 */
class ScrollIndicator extends Component {
  /**
   * Creates an instance of ScrollIndicator.
   */
  constructor() {
    super();
    this.state = {
      isVisible: true
    };
    this.onRouteChange = this.onRouteChange.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  /**
   * On mount run hide indicator logic.
   *
   */
  componentDidMount() {
    MicrozineEvents.addEventListener("microzineready", () => {
      //Router.addEventListener("routechange", this.onRouteChange);
      Scroller.addEventListener("mainPageScroll", this.onScroll);
    });
  }

  /**
   * Scroll listener
   */
  onScroll() {
    this.hideScroller();
  }

  /**
   * On router update.
   * @param {Object} e route object
   */
  onRouteChange(e) {
    // if it's a article detail page ... hide scroll bar
    if (e.type === "routechange" && e.article) {
      this.hideScroller();
    }
  }

  // cpeterson - Removing this cause the scroll indicator continues to show up on detail pages if direct linking.
  // We should be able to have this code. @todo -- modify so that we cant skip this re render.

  /**
   * React lifecycle - should we re render?
   *
   * @returns {boolean} true || false
   */
  // shouldComponentUpdate () {
  //   //return this.state.isVisible;
  // }

  /**
   * Hides the scroll bar.
   */
  hideScroller() {
    this.setState({ isVisible: false });
    //Once hidden never show again. Remove all listeners.
    // Router.removeEventListener("routechange", this.onRouteChange);
    Scroller.removeEventListener("mainPageScroll", this.onScroll);
    MicrozineEvents.removeEventListener("microzineready");
  }
  /**
   * React render
   * @returns {component} - react element
   */
  render() {
    return (
      <Wrapper
        className={`scroll_indicator ${this.state.isVisible ? "show" : ""}`}
      >
        Scroll for more
      </Wrapper>
    );
  }
}

export default ScrollIndicator;
