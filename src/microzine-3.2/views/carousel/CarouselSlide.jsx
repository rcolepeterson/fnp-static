import React, { Component } from 'react';
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import styled from 'styled-components';
import { colors } from 'microzine-3.2/styles/designSystem';

const Wrapper = styled.div`
  white-space: normal;
  background: #ccc;
  transition-delay: 0s;
  transition-duration: 250ms;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backface-visibility: hidden;
  &.leftOutside {
    z-index: -1;
    transform: translate3d(-120%, 0, 0);
  }
  &.left {
    z-index: -1;
    transform: translate3d(-100%, 0, 0);
  }
  &.placed {
    transform: translate3d(0, 0, 0);
    z-index: 9;
  }
  &.right {
    z-index: -1;
    transform: translate3d(100%, 0, 0);
  }
  &.rightOutside {
    z-index: -1;
    transform: translate3d(120%, 0, 0);
  }
`;

class Slide extends Component {
  constructor(props) {
    super(props);
    this.state = { selected: false };
  }
  startStopSlideThroughState(b = false) {
    this.setState({
      selected: b
    });
  }

  componentWillReceiveProps(nextProps) {
    this.selectedSlideIndex = nextProps.selectedSlideIndex;
    if (this.props.slideIndex === this.selectedSlideIndex) {
      setTimeout(() => {
        // make sure we are still selected. after the delay
        if (this.props.slideIndex === this.selectedSlideIndex) {
          this.startStopSlideThroughState(true);
        }
      }, 2000);
    } else {
      this.startStopSlideThroughState();
    }
  }
  render() {
    const Content = React.cloneElement(this.props.renderSlide(), {
      selected: this.state.selected
    });
    return <Wrapper className="slide">{Content}</Wrapper>;
  }
}

Slide.propTypes = {
  slideIndex: PropTypes.number.isRequired,
  selectedSlideIndex: PropTypes.number.isRequired,
  renderSlide: PropTypes.func.isRequired
};

export default Slide;
