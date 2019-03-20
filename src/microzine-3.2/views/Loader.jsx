import React from 'react'; //eslint-disable-line no-unused-vars
import styled from 'styled-components';
import { animation } from 'microzine-3.2/styles/designSystem';

const Wrapper = styled.svg`
  g {
    position: relative;
    transform: translate(15px, 15px);
    .bar {
      animation: ${animation.enter} 3s infinite;
    }
    .left {
      animation-delay: 0.3s;
    }
    .middle {
      animation-delay: 0s;
    }
    .right {
      animation-delay: 0.5s;
    }
  }
`;

const Loader = () => {
  return (
    <Wrapper
      width="82"
      height="101"
      viewBox="0 0 82 101"
      xmlns="http://www.w3.org/2000/svg"
      className="logo">
      <defs>
        <mask id="MZLogoMask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <path
            fill="black"
            d="M6.976 51.73c-.097.636.342 1.078.927 1.078h5.754c.488 0 .878-.393.927-.785l2.145-15.148h.098l8.241 15.884c.147.294.537.539.83.539h.877c.244 0 .683-.245.829-.54l8.192-15.883h.098l2.194 15.148c.05.392.488.785.927.785h5.754c.585 0 1.024-.442.927-1.079l-5.51-32.945c-.05-.44-.488-.784-.878-.784h-.78c-.245 0-.683.196-.83.49L26.385 39.67h-.098L14.974 18.49c-.146-.294-.585-.49-.83-.49h-.78c-.39 0-.828.343-.877.784L6.977 51.73z"
          />
        </mask>
      </defs>
      <g
        fill="none"
        fillRule="evenodd"
        opacity=".3"
        y="16.701"
        x="16.701"
        mask="url(#MZLogoMask)">
        <rect
          className="bar left"
          fill="#838383"
          style={{ mixBlendMode: 'multiply' }}
          y="6.701"
          width="29.589"
          height="57.902"
          rx="3"
        />
        <rect
          className="bar middle"
          fill="#838383"
          style={{ mixBlendMode: 'multiply' }}
          x="12.66"
          width="24.948"
          height="70.415"
          rx="3"
        />
        <rect
          className="bar right"
          fill="#838383"
          style={{ mixBlendMode: 'multiply' }}
          x="25.436"
          y="11.844"
          width="26.063"
          height="48.303"
          rx="3"
        />
      </g>
    </Wrapper>
  );
};

export default Loader;
