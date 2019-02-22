import React from 'react'; //eslint-disable-line no-unused-vars
import styled from 'styled-components';
import { typeSizes } from 'microzine-3.2/styles/designSystem';
import { ButtonStyle } from 'microzine-3.2/views/partials/buttons/Button';
import PropTypes from 'prop-types';

const ButtonWithPromo = styled(ButtonStyle)`
  height: 40px;
  font-size: ${typeSizes[2]};
  justify-content: left;

  span:last-child {
    position: absolute;
    right: 10px;
    width: 20px;
    background-position: center;
    background-repeat: no-repeat;
  }
`;

const PromoButton = ({ children, icon, href }) => {
  const clickHandler = () => {
    if (href) {
      window.open(href, '_blank');
      return;
    }
    console.warn('prmot btn click but no props.href');
  };
  if (icon === 'arrow') {
    icon = (
      <span>
        <svg id="Menu" viewBox="0 0 40 40">
          <polygon
            id="lgArrow"
            className="cls-1"
            points="14.08 6.04 11.96 8.16 23.8 20 11.96 31.84 14.08 33.96 28.04 20 14.08 6.04"
          />
        </svg>
      </span>
    );
  }
  return (
    <ButtonWithPromo onClick={clickHandler}>
      {children}
      {icon}
    </ButtonWithPromo>
  );
};

PromoButton.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.string
};

export default PromoButton;
