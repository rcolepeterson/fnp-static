import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import Properties from 'microzine-3.2/helpers/MicrozineProperties';
import styled from 'styled-components';
import { fonts } from 'microzine-3.2/styles/designSystem';

const FooterWrapper = styled.div`
  width: 100%;
  bottom: 0;
  cursor: pointer;
  position: relative;
  padding-bottom: 0;
  z-index: 1;
  box-sizing: border-box;
  margin: 0 auto;
  max-width: 1022px;

  ${fonts.Info};
  background-color: white;
  text-align: left;
  padding: 42px 0 38px 0;
  display: block;
  height: 0px;
  background-repeat: no-repeat;
  background-size: 120px;
  background-position: 76px 26px;

  div {
    width: 100%;
    position: relative;
    box-sizing: border-box;
    text-align: center;
  }
  span:first-child {
    top: -17px;
    height: 14px;
    display: block;
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    width: 100%;
    bottom: 12px;
  }
  span:last-child {
    top: 0;
    position: absolute;
    text-transform: capitalize;
    font-size: 10px;
    color: #d8d8d8;
    left: 0;
    right: 0;
  }
  html[data-mode='interstitial'] #article_wrapper & {
    margin-bottom: 40px;
  }
`;

/**
 * Footer componenet
 *
 * @extends {Component}
 */
const Footer = () => (
  <a href="https://www.zumobi.com/" target="_blank">
    <FooterWrapper>
      <div>
        <span
          style={{
            backgroundImage: `url(${Properties.assetPath}/mz_logo_grey.svg)`
          }}
        />
        <span>powered by zumobi</span>
      </div>
    </FooterWrapper>
  </a>
);

export default Footer;
