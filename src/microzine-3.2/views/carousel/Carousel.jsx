import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import CarouselButton from 'microzine-3.2/views/carousel/CarouselButton';
import SlideShow from 'microzine-video-carousel-3.1/SlideShow-1.0';
import styled from 'styled-components';
import Slide from 'microzine-3.2/views/carousel/CarouselSlide';
import PropTypes from 'prop-types';
import { fonts } from 'microzine-3.2/styles/designSystem';

const Wrapper = styled.div`
  ${fonts.Body};
  position: relative;
  border-top: ${props => (props.topBorder ? '10px solid white;' : 0)};
  max-width: 1024px;
  margin: 0 auto;
  overflow: hidden;
  margin-top: 2px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  &:before {
    display: block;
    content: '';
    width: 100%;
    padding-top: 56.25%;
  }
`;

const CrumbContainer = styled.div`
  position: absolute;
  bottom: 15px;
  height: 5px;
  text-align: center;
  line-height: 5px;
  width: 100%;
  z-index: 9998;
  span {
    display: inline-block;
    width: 20px;
    height: 100%;
    border-radius: 0;
    margin: 0 4px;
    background-color: #9b9b9b;
    opacity: 0.5;
    &.selected {
      background-color: white;
      opacity: 1;
    }
  }
`;

const BrandTitleWrapper = styled.div`
  height: 30px;
  opacity: ${props => (props.selectedSlideIndex === 0 ? 0 : 1)};
  width: 100%;
  position: absolute;
  border-bottom: 0px solid #b2051b;
  z-index: 9999;
  transition: opacity 0.3s linear;
  top: 0;
  color: #fff;
  text-align: center;
  p {
    margin-top: 4px;
  }
  background: rgb(
    204,
    204,
    204
  ); /* Fallback for older browsers without RGBA-support */
  background: rgba(51, 51, 51, 0.5);
`;

const Carousel = class extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedSlideIndex: 0 };
  }
  /**
   * Loops thru props.children and create a slide component for each element.
   *
   * @returns {array} Array of slide components.
   */
  createSlideElements() {
    const children = React.Children.toArray(this.props.children);
    this.slides = children.map((child, i) => {
      return (
        <Slide
          key={i}
          slideIndex={i}
          selectedSlideIndex={this.state.selectedSlideIndex}
          renderSlide={() => child}
        />
      );
    });

    return this.slides;
  }
  /**
   * Create the slide show.
   */
  createSlideShow() {
    if (this.slideshow) {
      return;
    }
    let gestureContainer = document.getElementById('carousel-wrapper'),
      slideElems = document.querySelectorAll('.slide'),
      crumbsContainer = document.getElementById('crumbs_container'),
      prevButton = document.getElementById('slideshow_prev'),
      nextButton = document.getElementById('slideshow_next');

    this.slideshow = new SlideShow({
      autoplay: false
    });
    this.slideshow.create(
      gestureContainer,
      slideElems,
      crumbsContainer,
      prevButton,
      nextButton
    );

    this.slideshow.addEventListener('slidechanged', e => {
      this.setState({ selectedSlideIndex: e.index });
    });
  }
  /**
   * Denotes if this we are running on mobile or desktop.
   *
   * @returns {string} Style to apply.
   */
  isDesktop() {
    return this.props.isDesktop ? 'block' : 'none';
  }

  componentDidMount() {
    this.createSlideElements();
    this.createSlideShow();
  }

  componentDidUpdate() {
    if (!this.slideshow) {
      this.createSlideShow();
    }
  }

  render() {
    return (
      <Wrapper id="carousel-wrapper" {...this.props}>
        {this.createSlideElements()}
        <CarouselButton
          style={{ display: this.isDesktop() }}
          direction="left"
        />
        <CarouselButton
          style={{ display: this.isDesktop() }}
          direction="right"
        />
        <CrumbContainer id="crumbs_container" />
        {this.props.showBrandHeader && (
          <BrandTitleWrapper selectedSlideIndex={this.state.selectedSlideIndex}>
            <p>Star Wars</p>
          </BrandTitleWrapper>
        )}
      </Wrapper>
    );
  }
};

Carousel.propTypes = {
  isDesktop: PropTypes.bool,
  showBrandHeader: PropTypes.bool,
  topBorder: PropTypes.bool
};

export default Carousel;
