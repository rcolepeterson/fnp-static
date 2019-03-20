import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom'; //eslint-disable-line no-unused-vars
import MicrozineEvents from 'microzine-3.2/helpers/MicrozineEvents';
import Scroller from 'microzine-3.2/api/Scroller';
import Loader from 'microzine-3.2/views/Loader';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;

  &.visible {
    visibility: visible;
    height: 120px;
    .loader-bars {
      display: flex;
    }
  }
`;

/**
 * This what's shown while the next article loads - Group View
 *
 * @class PageIndicator
 * @extends {Component}
 */
class PageIndicator extends Component {
  constructor() {
    super();
    this.state = {
      isVisible: false,
      isActive: true
    };
  }

  componentDidMount() {
    Scroller.addEventListener('mainPageScroll', this._handleScroll.bind(this));
    MicrozineEvents.addEventListener('nextcollectionloaded', () =>
      this.setState({ isVisible: false })
    );
    MicrozineEvents.addEventListener('allcollectionsloaded', () =>
      this.setState({ isActive: false })
    );
  }

  render() {
    return (
      <Wrapper
        ref={e => (this._element = e)}
        className={
          this.state.isActive && this.state.isVisible ? 'visible' : ''
        }>
        <Loader />
      </Wrapper>
    );
  }

  _handleScroll(e) {
    if (!this._element) {
      return;
    }

    let scrollTop = e.scrollTop,
      pageHeight = document.body.clientHeight,
      elemTop = ReactDOM.findDOMNode(this._element).offsetTop;

    if (!this.state.isVisible && scrollTop + pageHeight >= elemTop - 100) {
      this.setState({ isVisible: true });
      MicrozineEvents.dispatchEvent('loadnextcollection');
    }
  }
}

export default PageIndicator;
