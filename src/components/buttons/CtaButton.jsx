import React from "react"; //eslint-disable-line no-unused-vars
//import Properties from 'microzine-3.2/helpers/MicrozineProperties';
import styled from "styled-components";
import { colors, typeSizes } from "../../styles/designSystem";
import { ButtonStyle } from "./Button";
import PropTypes from "prop-types";

const Wrapper = styled.div`
  margin-top: 0;
  padding: 10px;
  background-color: #ffffff;
  max-width: 1022px;
  margin: 0 auto;
  a {
    text-decoration: none;
  }
`;

const CTAButton = styled(ButtonStyle)`
  box-sizing: border-box;
  margin: 0;
  border: 2px solid #3e606f;
  background-color: #3e606f;
  color: white;
  font-size: ${typeSizes[2]};
  width: 100%;
  justify-content: left;
  height: 40px;
  span:last-child {
    position: absolute;
    right: 1px;
    top: 1px;
    width: 35px;
    height: 35px;
    background-position: center;
    background-repeat: no-repeat;
  }
  span:last-child svg {
    fill: white;
    width: 34px;
  }
`;

/**
 * Microzine call to action button
 */
const CtaButton = ({ label = "Explore More", arrow = true }) => (
  <Wrapper>
    <a target="_blank" rel="noopener noreferrer" shref={"//www.zumobi.com"}>
      <CTAButton className="button">
        <span>{label}</span>
        <span>
          {arrow && (
            <svg id="Menu" viewBox="0 0 40 40">
              <polygon
                id="lgArrow"
                className="cls-1"
                points="14.08 6.04 11.96 8.16 23.8 20 11.96 31.84 14.08 33.96 28.04 20 14.08 6.04"
              />
            </svg>
          )}
        </span>
      </CTAButton>
    </a>
  </Wrapper>
);

CtaButton.propTypes = {
  label: PropTypes.string,
  arrow: PropTypes.bool
};

export default CtaButton;
