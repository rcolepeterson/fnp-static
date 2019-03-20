import { css, keyframes } from "styled-components";

export const breakpoints = {
  xsmall: 375,
  small: 540,
  medium: 720,
  large: 960
};

export const media = {
  xsmall: (...args) => css`
    @media (max-width: ${breakpoints.xsmall}px) {
      ${css(...args)};
    }
  `,
  small: (...args) => css`
    @media (min-width: ${breakpoints.xsmall +
        1}px) and (max-width: ${breakpoints.small}px) {
      ${css(...args)};
    }
  `,
  medium: (...args) => css`
    @media (min-width: ${breakpoints.small +
        1}px) and (max-width: ${breakpoints.medium}px) {
      ${css(...args)};
    }
  `,
  large: (...args) => css`
    @media (min-width: ${breakpoints.medium +
        1}px) and (max-width: ${breakpoints.large}px) {
      ${css(...args)};
    }
  `,
  xlarge: (...args) => css`
    @media (min-width: ${breakpoints.large}px) {
      ${css(...args)};
    }
  `,
  xsmallUp: (...args) => css`
    @media (min-width: ${breakpoints.xsmall}px) {
      ${css(...args)};
    }
  `,
  smallUp: (...args) => css`
    @media (min-width: ${breakpoints.small}px) {
      ${css(...args)};
    }
  `,
  mediumUp: (...args) => css`
    @media (min-width: ${breakpoints.medium}px) {
      ${css(...args)};
    }
  `,
  largeUp: (...args) => css`
    @media (min-width: ${breakpoints.large}px) {
      ${css(...args)};
    }
  `
};

export const colors = {
  brand: "#3E606F",
  brandSecondary: "#5f000d",
  background: "#E5E5E5",
  black: "#333",
  lightBlack: "#838383",
  grey: "#838383",
  mediumGrey: "#B2B2B2",
  lightGrey: "#F6F6F6"
};

export const typeSizes = ["11px", "14px", "16px"];

const fontFamilies = {
  body: "Open Sans, sans-serif"
};

export const fontWeights = {
  regular: 400,
  semiBold: 600,
  bold: 700
};

export const fonts = {
  Title: css`
    color: ${colors.black};
    font-size: ${typeSizes[2]};
    font-family: ${fontFamilies.body};
    font-weight: ${fontWeights.semiBold};
    line-height: 20px;
  `,
  Body: css`
    color: ${colors.black};
    font-size: ${typeSizes[1]};
    font-family: ${fontFamilies.body};
    font-weight: ${fontWeights.regular};
    line-height: 22px;
  `,
  Info: css`
    font-size: ${typeSizes[0]};
    color: ${colors.mediumGrey};
    font-family: ${fontFamilies.body};
    font-weight: ${fontWeights.regular};
    line-height: ${typeSizes[0]};
  `
};

export const animation = {
  rotate: keyframes`
    0% {
      -webkit-transform: rotate(0deg)
    }
    100% {
      -webkit-transform: rotate(360deg)
    }
  `,
  enter: keyframes`
    0% {
      opacity: 0;
      transform: translate(0px, 15px);
    }
    20% {
      opacity: 0;
      transform: translate(0px, 15px);
    }
    30% {
      opacity: 1;
      transform: translate(0px, 0px);
    }
    90% {
      opacity: 1;
      transform: translate(0px, 0px);
    }
    100% {
      opacity: 0;
      transform: translate(0px, -15px);
    }
  `,
  fade_to_channels: keyframes`
    0% {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }

    40% {
      opacity: 0;
      transform: translate3d(0, 50px, 0);
    }

    60% {
      opacity: 0;
      transform: translate3d(0, -50px, 0);
    }

    100% {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  `,
  fade_to_article: keyframes`
    0% {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }

    40% {
      opacity: 0;
      transform: translate3d(0, -50px, 0);
    }

    60% {
      opacity: 0;
      transform: translate3d(0, 50px, 0);
    }

    100% {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  `,
  slidein: keyframes`
    from {
        opacity: 0;
        transform: translate3d(0, 20px, 0);
        visibility: collapse;
      }

    to {
      opacity: 1;
      visibility: visible;
    }
  `,
  fadein: keyframes`
    from {
      opacity: 0;
      visibility: collapse;
    }

    to {
      opacity: 0.3s;
      visibility: visible;
    }
  `,
  slideout: keyframes`
    from {
      opacity: 1;
      visibility: visible;
    }

    to {
      opacity: 0;
      transform: translate3d(0, 20px, 0);
      visibility: collapse;
    }
  `,
  fadeout: keyframes`
    from {
      opacity: 0.3s;
      visibility: visible;
    }

    to {
      opacity: 0;
      visibility: collapse;
    }
  `
};
