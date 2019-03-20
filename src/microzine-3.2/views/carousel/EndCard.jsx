import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import styled from 'styled-components';
import PromoButton from 'microzine-3.2/views/partials/buttons/PromoButton';
import { fonts } from 'microzine-3.2/styles/designSystem';
import { media } from 'microzine-3.2/styles/designSystem';

const Wrapper = styled.div`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  background: black;
  color: white;
  text-transform: uppercase;
  z-index: 9999;
  background: #000;
  font-size: ${fonts.Body};
  .container {
    position: relative;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 420px;
  }

  .grid {
    margin: 0 0 0 0;
  }

  /* outside padding */
  .grid-pad {
    padding: 10px 0 10px 20px;
  }
  .grid-pad [class*='col-']:last-of-type {
    padding-right: 20px;
  }

  .module {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &.text {
      height: 50px;

      p {
        display: block;
        /* Fallback for non-webkit */
        display: -webkit-box;
        max-width: 400px;
        height: 20px;
        /* Fallback for non-webkit */
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      ${media.xsmallUp`
         height: 65px;
         p {
          font-size:12px;
          height: 24px;
         }
      `};

      ${media.smallUp`
         height: 73px;
      `};

      /* style for WATCH NOW button
         cant get styled link to work. @todo figure out why extending does not work.
         so i am just directly targeting div.
      */
      > div {
        margin-top: 8px;
        align-self: flex-end;
        font-size: 10px;
        height: 20px;
        width: 60%;
        span {
          top: 3px;
          right: 3px;
          svg {
            width: 14px;
          }
        }
      }
    }
  }
  [class*='col-'] {
    float: left;
  }
  .col-2-3 {
    width: 66.66%;
  }
  .col-1-3 {
    width: 33.33%;
  }
  .grid:after {
    content: '';
    display: table;
    clear: both;
  }

  [class*='col-'] {
    padding-right: 10px;
  }
  [class*='col-']:last-of-type {
    padding-right: 0;
  }

  .aspect {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    border: 2px solid white;
  }

  .aspect-inner {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #444;
  }

  img {
    max-width: 100%;
    width: 100%;
  }

  .aspect-16x9 {
    padding-bottom: 56.25%;
  }

  .divider {
    border: 1px solid #2b333f;
    margin-right: 20px;
    margin-left: 20px;
  }
`;

// const StyledLink = styled(PromoButton)`
//   width: 50%;
//   font-size: 10px;
//   float: right;
// `;

const RelatedWrapper = styled.div``;

const EndCard = ({ relatedVideos, changeVideoURL }) => {
  if (!relatedVideos) {
    return null;
  }
  const videos = relatedVideos.map(({ img, videoURL, desc }, i) => {
    return (
      <RelatedWrapper>
        <div className="grid grid-pad">
          <div className="col-1-3">
            <div className="module">
              <div className="aspect aspect-16x9">
                <div className="aspect-inner">
                  <img src={img} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-2-3">
            <div
              className="module text"
              onClick={() => changeVideoURL(videoURL)}>
              <p>{desc}.</p>
              <PromoButton style={{ fontSize: '10' }} icon={'arrow'}>
                Watch Now
              </PromoButton>
            </div>
          </div>
        </div>
      </RelatedWrapper>
    );
  });

  return (
    <Wrapper>
      <div className="container">
        {videos[0]}
        <div className="divider" />
        {videos[1]}
      </div>
    </Wrapper>
  );
};

EndCard.propTypes = {
  relatedVideos: PropTypes.array.isRequired,
  playAgain: PropTypes.func,
  changeVideoURL: PropTypes.func
};

export default EndCard;
