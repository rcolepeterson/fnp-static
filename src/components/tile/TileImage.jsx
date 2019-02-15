import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import styled from 'styled-components';
import { animation } from '../../styles/designSystem';
import PropTypes from 'prop-types';
const baseURL = 'https://cdn-prototype.microsites.partnersite.mobi'

const removeLoaderTimeMS = 500,
  heightMin = 60,
  heightMax = 510;

const Wrapper = styled.div`
  position: relative;
  height: ${props =>
    props.height === 'auto'
      ? 'auto'
      : props.height > heightMax
        ? `${heightMax}px`
        : props.height < heightMin
          ? `${heightMin}px`
          : `${props.height}px`};
  margin-bottom: 10px;
`;

const ImageInTile = styled.img`
  display: block;
  width: 100%;
  min-height: ${heightMin}px;
  transition: opacity ${removeLoaderTimeMS / 1000}s ease-in;
  opacity: ${props => props.opacity};
`;

const ImageContainer = styled.div`
  position: relative;
  max-height: ${heightMax}px;
  overflow: hidden;
`;

const LoadingCircleWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: #b4b4b4;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
//background-image: url(${Properties.assetPath}/broken.svg);
const ImageError = styled.div`
  background-color: #b4b4b4;
  opacity: 1;
  
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100px;
  height: 100%;
`;

const LoadingCircle = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.5);
  border-left: 4px solid #fff;
  border-radius: 100%;
  animation: ${animation.rotate} 1s linear infinite;
`;

/**
 * Microzine front-page TileImage component
 */
class TileImage extends Component {
  /**
   * Creates a new TileImage instance
   */
  constructor(props) {
    super(props);
    this.onImageError = this.onImageError.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);

    // set initial state
    this.state = {
      image: props.imageURL || '',
      loading: true,
      imageOpacity: 0,
      error: false
    };
  }

  /**
   * Hides the spinner and shows the main image
   *
   * @returns {void}
   */
  onImageLoad() {
    this.setState({
      imageOpacity: 1
    });
  }

  /**
   * On image error modify the style of the image holder and replace image src with error svg
   *
   */
  onImageError() {
    this.setState({
      error: true,
      loading: false
    });
  }




  componentDidMount() {
    if (this.state.imageOpacity === 1) {
      setTimeout(() => {
        this.setState({
          loading: false
        });
      }, removeLoaderTimeMS);
    }
  }



  /**
   * Renders the Tile image
   *
   * @returns {Component}   - TileImage component
   */
  render() {
    return (
      <Wrapper
        height={'auto'}
      >
        {
          this.state.loading && (
            <LoadingCircleWrapper>
              <LoadingCircle />
            </LoadingCircleWrapper>
          )
        }
        {
          this.state.error ? (
            <ImageError />
          ) : (
              this.state.image.length && (
                <ImageContainer>
                  <ImageInTile
                    onError={this.onImageError}
                    onLoad={this.onImageLoad}
                    opacity={this.state.imageOpacity}
                    src={`${baseURL}${this.props.imageURL}`}
                  />
                </ImageContainer>
              )
            )
        }
      </Wrapper >
    );
  }
}

TileImage.prototypes = {
  imageHeight: PropTypes.number.isRequired,
  imageURL: PropTypes.string
};

export default TileImage;
