import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import styled, { keyframes } from 'styled-components';

const Wrapper = styled.span`
  display: block;
  text-align: center;
  position: absolute;
  width: calc(100% - 20px);
  left: 10px;
  height: 20px;
  top: -20px;
  pointer-events: none;
  font-size: 10px;
  transition: margin 0.7s ease-out, opacity 0.7s ease-out;
  overflow: hidden;

  > div {
    background-color: rgba(0, 0, 0, 0.5);
    animation: 1s ease-out ${keyframes`
      0% {
        margin-top: 20px
      }
      100% {
        margin-top: 0px
      }
    `};

    span:first-child {
      position: absolute;
      left: 20px;
    }

    span:nth-child(2) {
      position: relative;
      color: #ffffff;
      text-transform: uppercase;
      font-size: 11px;
      line-height: 11px;
      opacity: 0.5;
    }

    span:last-child {
      position: absolute;
      right: 20px;
    }

    svg {
      opacity: 0.5;
      width: 20px;
      fill: #ffffff;
      transform: rotate(90deg);
    }
  }
`;

class ArticleExpandButton extends Component {
  render(props) {
    return (
      <Wrapper>
        <div>
          <span>
            <svg id="Menu" viewBox="0 0 15 15">
              <path
                id="smArrow"
                class="cls-1"
                d="M5.93,3.13l-.18.19-.51.53L5.07,4l.16.17,3,3.3-3,3.3L5.07,11l.16.17.51.53.18.19.18-.2,3.66-4,.15-.17-.15-.17-3.66-4-.18-.2Z"
              />
            </svg>
          </span>
          <span>{props.text}</span>
          <span>
            <svg id="Menu" viewBox="0 0 15 15">
              <path
                id="smArrow"
                class="cls-1"
                d="M5.93,3.13l-.18.19-.51.53L5.07,4l.16.17,3,3.3-3,3.3L5.07,11l.16.17.51.53.18.19.18-.2,3.66-4,.15-.17-.15-.17-3.66-4-.18-.2Z"
              />
            </svg>
          </span>
        </div>
      </Wrapper>
    );
  }
}

export default ArticleExpandButton;
