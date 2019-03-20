import React from 'react'; //eslint-disable-line no-unused-vars
import Properties from 'microzine-3.2/helpers/MicrozineProperties';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const WrapperButton = styled.button`
  width: 40px;
  height: 100px;
  background: rgba(0, 0, 0, 0) url(${Properties.assetPath}/back_arrow_white.svg)
    no-repeat center center;
  border: none;
  border-radius: 0 4px 4px 0;
  position: absolute;
  left: ${props => (props.direction === 'left' ? 0 : 'auto')};
  right: ${props => (props.direction === 'right' ? 0 : 'auto')};
  outline: none;
  cursor: pointer;
  z-index: 10;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
  transform-origin: 50% 50%;
  transform: ${props =>
    props.direction === 'left' ? 'scaleX(1)' : 'scaleX(-1)'};
  color: ${props => props.color};
`;

// this must be done to get prop types to work in storybook
const CarouselButton = props => {
  let id = props.direction === 'left' ? 'slideshow_prev' : 'slideshow_next';
  return <WrapperButton {...props} id={id} />;
};

CarouselButton.propTypes = {
  direction: PropTypes.string,
  color: PropTypes.string,
  id: PropTypes.string
};

export default CarouselButton;
