import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors, fontWeights } from 'microzine-3.2/styles/designSystem';

const Wrapper = styled.button`
  height: 20px;
  border: 0;
  background-color: transparent;
  color: ${colors.brand};
  text-transform: capitalize;
  font-size: 12px;
  font-weight: ${fontWeights.regular};
  border-radius: 0;
  outline: none;
  line-height: 30px;
  cursor: pointer;
  svg {
    height: 20px;
    top: 6px;
    position: relative;
    path {
      fill: ${colors.brand};
    }
  }
`;

const ArrowButton = ({ className, label = 'Read More' }) => (
  <Wrapper className={className}>
    {label}
    <svg viewBox="0 0 15 15">
      <path
        className="cls-1"
        d="M5.93,3.13l-.18.19-.51.53L5.07,4l.16.17,3,3.3-3,3.3L5.07,11l.16.17.51.53.18.19.18-.2,3.66-4,.15-.17-.15-.17-3.66-4-.18-.2Z"
      />
    </svg>
  </Wrapper>
);

ArrowButton.propTypes = {
  label: PropTypes.string
};

export default ArrowButton;
