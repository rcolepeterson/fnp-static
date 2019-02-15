import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
//import Properties from 'microzine-3.2/helpers/MicrozineProperties';
import styled from 'styled-components';
import { fonts } from '../../styles/designSystem';
// @todo - replace with config 
const Properties = {};
Properties.brandName = "Fuel & Petrols";

/**
 * Microzine front-page TileChannelBar component
 */
class TileChannelBar extends Component {
  constructor(props) {
    super(props);
    switch (props.article.article_extras.source.toString().toLowerCase()) {
      case 'twitter':
        this.topInfo = '@' + props.article.extras.screen_name;
        break;
      default:
        this.topInfo = Properties.brandName;
    }
  }
  /**
   * Renders the Tile channel bar
   *
   * @param {Object} props  - Properties set for this channel bar
   * @param {Object} state  - Current state of this channel bar
   * @returns {Component}   - TileChannelBar component
   */
  render() {

    return (
      <Wrapper className="front_page_channel">
        <Source
          className={this.props.article.article_extras.source}
          style={{ backgroundImage: `url(${this.props.article.icon})` }}
        />
        <SourceInfo>
          <span>{this.topInfo}</span>
          <span className="sub_head">{this.props.bottomInfo}</span>
        </SourceInfo>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  text-align: left;
  display: flex;

  .instagram {
    background: url(./instagram.svg) no-repeat left top,
      radial-gradient(
        circle farthest-corner at 35% 90%,
        #fec564,
        transparent 50%
      ),
      radial-gradient(
        circle farthest-corner at 0 140%,
        #fec564,
        transparent 50%
      ),
      radial-gradient(
        ellipse farthest-corner at 0 -25%,
        #5258cf,
        transparent 50%
      ),
      radial-gradient(
        ellipse farthest-corner at 20% -50%,
        #5258cf,
        transparent 50%
      ),
      radial-gradient(
        ellipse farthest-corner at 100% 0,
        #893dc2,
        transparent 50%
      ),
      radial-gradient(
        ellipse farthest-corner at 60% -20%,
        #893dc2,
        transparent 50%
      ),
      radial-gradient(
        ellipse farthest-corner at 100% 100%,
        #d9317a,
        transparent
      ),
      linear-gradient(
        #6559ca,
        #bc318f 30%,
        #e33f5f 50%,
        #f77638 70%,
        #fec66d 100%
      ) !important;
    height: 26px;
    width: 26px;
  }
  .blog,
  .blog2019,
  .cms {
    background-color: #f7a700;
  }
  .youtube {
    background-color: #fe3432;
  }
  .twitter, .bofa-twitter {
    background-color: #2daae1;
  }
  .facebook {
    background-color: #3c5b9b;
  }
`;

const Source = styled.span`
  display: inline-block;
  background-size: cover;
  height: 26px;
  width: 26px;
  top: 0;
  position: relative;
  top: 0;
`;

const SourceInfo = styled.span`
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  ${fonts.Info};
  > span:first-child {
    padding-bottom: 4px;
  }
`;

export default TileChannelBar;
