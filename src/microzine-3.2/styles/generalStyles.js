import {
  colors,
  fontWeights,
  animation
} from 'microzine-3.2/styles/designSystem';
import { css } from 'styled-components';

export const generalStyles = css`
  @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600,700');

  /* apply a natural box layout model to all elements, but allowing components to change */
  html {
    box-sizing: border-box;
  }
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  html,
  body {
    font-family: 'Open Sans', sans-serif;
    font-weight: ${fontWeights.regular};
    height: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
  }

  body {
    min-height: 100%;
    background-color: #e5e5e5;
    margin: 0;
    > img {
      position: absolute;
      top: -10px;
      left: -10px;
    }
  }

  .prevent_transition {
    transition: none !important;
  }

  #article_share {
    top: 0;
    z-index: 12;
  }

  html {
    &[data-mode='interstitial'] {
      #article_close {
        > div {
          width: 100%;
          height: 100%;
        }
        .target {
          width: 100%;
        }
      }
    }
    &[data-iframe='inIframe'] {
      width: 100%;
      height: 100%;
      margin: auto;

      #content {
        overflow: auto;
        -webkit-overflow-scrolling: touch;
      }
      #microzine,
      #content {
        width: 100%;
        height: 100%;
      }
    }
  }

  #back_to_top {
    &.share_main .to_top {
      left: 20px;
      transform: translate3d(0px, 0px, 0px) !important;
    }
    &.to_top_main .to_top {
      bottom: 20px;
      left: 20px;
      transform: translate3d(0px, 0px, 0px) !important;
      visibility: visible;
    }
  }
  .animate_fade_to_article {
    animation-name: ${animation.fade_to_article};
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-timing-function: ease;
  }

  .animate_fade_to_channels {
    animation-name: ${animation.fade_to_channels};
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-timing-function: ease;
  }

  #content,
  #microzine {
    width: 100%;
    height: 100%;
  }

  .hash_tag,
  .mention,
  .link {
    color: ${colors.brand};
    font-weight: ${fontWeights.regular};
    text-decoration: none;
  }

  .link {
    text-decoration: none;
    text-decoration: underline;
  }

  nobr {
    white-space: nowrap;
  }

  #article_wrapper {
    .promo_button,
    #shoppable {
      margin-top: 0;
      border-top: 2px solid #e5e5e5;
    }
  }

  #brand_header {
    position: fixed;
    transition: height 0.3s;
    width: 100vw;
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    height: 170px;
    cursor: pointer;
    transform: translate3d(0px, 40px, 0px);
    box-shadow: none;
  }

  #wrapper {
    background-color: #e5e5e5;
    position: relative;
    top: 210px;
    overflow: inherit;
    z-index: 2;
    width: 100%;
    &.inherit {
      top: inherit;
    }
    &.pin_bottom {
      position: absolute;
      bottom: 100%;
    }
  }

  #microzine {
    position: relative;
    .none {
      display: none;
    }
    #header {
      background-color: ${colors.brand};
      border-bottom: 3px solid ${colors.brandSecondary};
      position: fixed;
      width: 100%;
      height: 42px;
      box-sizing: border-box;
      top: 0;
      z-index: 3;
      .brand_title {
        height: 100%;
        width: 160px;
        margin: auto;
        position: relative;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
  }

  @media (min-width: 768px) {
    #wrapper {
      top: 290px;
    }
    #brand_header {
      height: 250px;
    }
  }

  @media screen and (min-width: 700px) {
    #article_share:not(.share_main) .share_button {
      right: calc((100% - 660px) / 2);
    }
    #back_to_top .to_top {
      left: calc((100% - 660px) / 2);
      transform: translate3d(0px, 0px, 0px) !important;
    }
  }
  @media screen and (min-width: 1022px) {
    #article_share.share_main .share_button {
      right: calc((100% - 982px) / 2);
    }
    #back_to_top.share_main .to_top {
      bottom: 20px;
      left: calc((100% - 1022px) / 2 + 20px);
      transform: translate3d(0px, 0px, 0px) !important;
    }
  }

  @media (min-width: 1440px) {
    #brand_header {
      height: 320px;
    }
    #wrapper {
      top: 360px;
    }
  }
`;
