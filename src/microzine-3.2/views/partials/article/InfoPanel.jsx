import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import styled, { css } from 'styled-components';
import { fonts } from 'microzine-3.2/styles/designSystem';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  ${fonts.Info};
  color: #b2b2b2;
  text-transform: capitalize;
  margin: 10px;
  height: 11px;
  position: relative;
  span:first-child {
    position: absolute;
  }
  span:last-child {
    position: absolute;
    right: 0;
  }
  ${({ facebook }) =>
    facebook &&
    css`
      span {
        &:first-child {
          position: initial;
        }
        &:last-child {
          position: relative;
          padding-left: 5px;
        }
      }
    `};
`;

const InfoPanel = props => {
  if (props.leftInfo === '' && props.rightInfo === '') {
    return null;
  }
  return (
    <Wrapper {...props}>
      {props.leftInfo ? <span>{props.leftInfo}</span> : <span />}
      {props.rightInfo ? <span>{props.rightInfo}</span> : <span />}
    </Wrapper>
  );
};

InfoPanel.propTypes = {
  leftInfo: PropTypes.string,
  rightInfo: PropTypes.string
};

export default InfoPanel;
