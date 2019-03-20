import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import Scroller from 'microzine-3.2/api/Scroller';
import Page from 'microzine-3.2/api/Page';
import Router from 'microzine-3.2/api/Router';
import styled from 'styled-components';
import Properties from 'microzine-3.2/helpers/MicrozineProperties';

const BackToTopButton = styled.button`
  transition: opacity 0.7s ease-out;
  -webkit-transition: opacity 0.7s ease-out;
  z-index: 11;
  position: fixed;
  outline: none;
  border: 0;
  background-color: #000;
  width: 40px;
  height: 40px;
  bottom: 20px;
  left: 20px;
  color: white;
  opacity: 0;
  visibility: collapse;
  &:active {
    opacity: 0.7;
  }
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0%;
    left: 0%;
    z-index: -1;
    background: url(${Properties.assetPath}/lgArrow.svg) 0 0 repeat;
    -webkit-transform: rotate(270deg);
    -moz-transform: rotate(270deg);
    -ms-transform: rotate(270deg);
    -o-transform: rotate(270deg);
    transform: rotate(270deg);
  }

  &.show_to_top {
    visibility: visible;
    opacity: 0.5;
  }

  [data-mode='interstitial'] & {
    bottom: 60px;
  }
  .share_main & {
    [data-mode='interstitial'] & {
      bottom: 20px;
    }
  }
`;

// Amount of page scroll before showing the BackToTop button.
const MAX_PERCENT_SCROLLED = 10;

/**
 * BackToTop - Back to top button located on front page and at the article level.
 *
 */
class BackToTop extends Component {
  /**
   * Creates an instance of the BackToTop Button.
   */
  constructor() {
    super();
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleRouteChange = this.handleRouteChange.bind(this);
  }
  /**
   * Lifecyle - Mount
   * @returns {void}
   */
  componentDidMount() {
    Scroller.addEventListener('scroll', this.handleScroll);
    Scroller.addEventListener('articleScroll', this.handleScroll);
    Scroller.addEventListener('mainPageScroll', this.handleScroll);
    Page.addEventListener('resize', this.handleResize);
    Router.addEventListener('routechange', this.handleRouteChange);
  }

  /**
   * Lifecycle - Will unmount
   * @returns {void}
   */
  componentWillUnmount() {
    this.isVisible = false;
    Scroller.removeEventListener('scroll', this.handleScroll);
    Scroller.removeEventListener('articleScroll', this.handleScroll);
    Scroller.removeEventListener('mainPageScroll', this.handleScroll);
    Page.removeEventListener('resize', this.handleResize);
    Router.removeEventListener('routechange', this.handleRouteChange);
  }

  /**
   * On route change handler
   *
   * @returns {void}
   */
  handleRouteChange() {
    // hide 1st and then see if we need it.
    this.hideBackToTop();
    setTimeout(() => {
      this.hideShowButton();
    }, 500);
  }

  /**
   * On resize  handler
   *
   * @returns {void}
   */
  handleResize() {
    setTimeout(() => {
      this.hideShowButton();
    }, 1000);
  }

  /**
   * On scroll handler
   *
   * @returns {void}
   */
  handleScroll() {
    this.hideShowButton();
  }

  /**
   * Gets thew viewport height.
   *
   * @returns {number} - height of viewport.
   */
  getWindowHeight() {
    return Math.max(document.body.clientHeight, window.innerHeight);
  }

  /**
   * Do we have a scrollbar. Based on content being taller than the window?
   *
   * @returns {boolean} true || false
   */
  hasScrollbar() {
    let article = document.querySelector('#article_wrapper');
    let value = true;
    if (article && article.clientHeight > 0) {
      value = article.clientHeight > this.getWindowHeight();
    }

    return value;
  }

  /**
   * Hide or show
   *
   * Show if we have scrolled more that 90% of the page.
   * Show if the page will never use a scroll bar.
   *
   * @returns {void}
   */
  hideShowButton() {
    // Show BackToTop button if NO scrollbar. Meaning the content all fits on the page withput scrolling.
    // This is per design. They say it looks funny with out the btn.
    if (!this.hasScrollbar()) {
      this.showBackToTop();
      return;
    }

    let p = Scroller.percentageScrolled();

    if (!this.isVisible && p > MAX_PERCENT_SCROLLED) {
      this.showBackToTop();
    } else if (this.isVisible && p < MAX_PERCENT_SCROLLED) {
      this.hideBackToTop();
    }
  }

  /**
   * Shows the back to top button
   * @returns {void}
   */
  showBackToTop() {
    this.backToTop.classList.add('show_to_top');
    this.isVisible = true;
  }
  /**
   * Hides the back to top button
   * @returns {void}
   */
  hideBackToTop() {
    this.backToTop.classList.remove('show_to_top');
    this.isVisible = false;
  }
  /**
   * Back to top click handler
   * @returns {void}
   */
  handleClick() {
    Scroller.smoothScrollTo(0, 500);
  }
  /**
   * Lifecycle - Will unmount
   * @returns {ReactComponent} - ReactComponent instance
   */
  render() {
    return (
      <div>
        <BackToTopButton
          onClick={this.handleClick}
          className="to_top"
          innerRef={node => (this.backToTop = node)}
        />
      </div>
    );
  }
}
export default BackToTop;
