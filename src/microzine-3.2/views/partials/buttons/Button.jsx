import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  fonts,
  colors,
  typeSizes,
  fontWeights
} from 'microzine-3.2/styles/designSystem';

const buttonFontColor = '#fff';

export const ButtonStyle = styled.div`
  ${fonts.Body};
  position: relative;
  background-color: ${colors.brand};
  line-height: ${typeSizes[1]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => (props.color ? props.color : buttonFontColor)};
  cursor: pointer;
  text-transform: uppercase;
  text-align: center;
  font-weight: ${fontWeights.semiBold};
  width: 100%;
  padding: 8px;
  box-sizing: border-box;

  svg {
    fill: ${props => (props.color ? props.color : buttonFontColor)};
    width: 28px;
  }
`;

// this must be done to get prop types to work in storybook
const Button = props => <ButtonStyle {...props}>{props.children}</ButtonStyle>;

Button.propTypes = {
  color: PropTypes.string,
  children: PropTypes.string.isRequired
};

export default Button;
