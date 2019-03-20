import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 50px;
  display: flex;
  justify-content: center;
  div:first-child {
    background-color: #b4b4b4;
    background-image: url(./loader_v2.gif);
    background-repeat: no-repeat;
    background-position: center;
  }
`;

/**
 * Documentation: https://zumobi.atlassian.net/wiki/spaces/3AS/pages/105775105/RTK
 *
 * This was last used in the Modular Microzine, there was an issue getting the ads to render
 * if they were lazy loaded so I had to say all ads were "duplicates"
 * Here's how it was used before, update if you made this more flexible:
 * <RTK adzone_rtk={window.mzMetadata.adzone_rtk_article} duplicate={true} width={300} height="auto"></RTK>
 *
 * You should also set the adZones and auction ID in the _mapping.yml file to make life easier on yourself.
 *
 * @class RTK
 * @extends {Component}
 */

class RTK extends Component {
  /**
   * RTK contructor
   * @param {Object} props props
   */
  constructor(props) {
    super(props);
    this.state = { playerContainerId: null };
  }

  static get defaultProps() {
    return {
      width: 300,
      height: 250,
      adzone: 0
    };
  }

  /**
   * Sets the adZone element Id and makes call to lazy load ad.
   * Need div id to follow 'RTK_' + adzone pattern.
   * @returns {void}
   */
  fillVariables() {
    let randomId =
      new Date().getTime().toString() +
      Math.round(Math.random() * 1000000000).toString();
    let adZone = `RTK_${this.props.adzone_rtk}`;
    let playerContainerId = `RTK_${this.props.adzone_rtk}`;
    let duplicateAdContainerID = null;
    // this adzone value has already been used ... create a unique container id.
    if (this.props.duplicate) {
      duplicateAdContainerID = `playerContainerId${randomId}`;
      playerContainerId = duplicateAdContainerID;
    }

    // define the adZone element id
    this.setState({
      playerContainerId: playerContainerId
    });

    this.loadAd(adZone, duplicateAdContainerID);
  }

  /**
   * Lazy Load Ad.
   * If adZone value has already been used we must refresh and point at new element id.
   * @param {string} adZone Adzone string
   * @param {string} duplicateAdContainerID Denotes we already used this adzone value. This is the new id to point the adzone code at.
   * @returns {void}
   */
  loadAd(adZone, duplicateAdContainerID) {
    setTimeout(() => {
      if (duplicateAdContainerID) {
        let obj = { [adZone]: duplicateAdContainerID };
        window.jitaJS.rtk.refreshAdUnits([adZone], false, obj);
      } else {
        window.jitaJS.rtk.refreshAdUnits([adZone], true);
      }
    }, 200);
  }

  play() {
    // noop
  }

  pause() {
    // noop
  }

  refreshAd() {
    // this.setState({ index: this.state.index + 1 });
  }

  componentWillMount() {
    this.fillVariables();
  }

  componentWillUpdate() {
    this.fillVariables();
  }

  componentDidMount() {
    this.loadAd();
  }

  componentDidUpdate() {
    this.loadAd();
  }

  /**
   * On new selected slide / in focus slide, check if this is the slide in focus and if so ... go get the ad. (Lazy Load)
   * @param {Object} nextProps - holds the update value.
   * @returns {void}
   */
  componentWillReceiveProps(nextProps) {
    if (
      this.state.playerContainerId === null &&
      nextProps.selectedSlideIndex === this.props.indexNumber
    ) {
      this.fillVariables();
    }
  }

  /**
   * Render AdZone UI id has been defined. The id will be defined if this ad unit is in focus.
   * Need div id to follow 'RTK_' + adzone pattern.
   *
   * Note the ad loader is being passed in as a child element.  {this.props.children}
   * @returns {element} - react element
   */
  render() {
    return (
      <Wrapper>
        {this.props.children}
        {this.state.playerContainerId && (
          <div
            id={this.state.playerContainerId}
            style={{
              width: this.props.width,
              height: this.props.height,
              overflow: 'hidden',
              position: 'relative',
              zIndex: 2
            }}
          />
        )}
      </Wrapper>
    );
  }
}

export default RTK;
