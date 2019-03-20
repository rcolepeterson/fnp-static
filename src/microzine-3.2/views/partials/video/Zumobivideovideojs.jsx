import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
//import Properties from 'microzine-3.2/helpers/MicrozineProperties';
import InView from 'microzine-3.2/helpers/fns/InView';
import scriptCache from 'microzine-3.2/api/ScriptCache';
import VideoJsMetrics from 'microzine-3.2/helpers/fns/VideoJsMetrics';
import Logger from 'microzine-3.2/helpers/Logger';
//import styled from 'styled-components';
import PropTypes from 'prop-types';
import EndCard from 'microzine-3.2/views/carousel/EndCard';
import VideoJSStyle from './videoJSStyles.js';

const throwIfMissing = val => {
  Logger.error(`Zumobivideovideojs: missing ${val}`);
};

/**
 * Zumobivideovideojs
 * https://zumobi.atlassian.net/browse/ZFP-556
 *  video component.
 */
class Zumobivideovideojs extends Component {
  /**
   * Constructor
   * @param {Object} props compnent properties
   */
  constructor(props) {
    super(props);
    this.videoplayer = null;
    this.state = {
      videoplayer: null
    };
    window.HELP_IMPROVE_VIDEOJS = false;
    this.handleViewChange = this.handleViewChange.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.changeVideoURL = this.changeVideoURL.bind(this);
  }

  /**
   * Add event listeners.
   * @returns {void}
   */
  addEvents() {
    this.videoplayer.on('timeupdate', this.timeupdateHandler.bind(this));
    // this.videoplayer.on('ended', this.onPlayerEnded.bind(this));
    // this.videoplayer.on('loadedmetadata', this.loadedmetadata.bind(this));
    this.videoplayer.on('ended', this.videoEnded.bind(this));
  }

  /**
   * Denotes if we want the video play on load.
   *
   * @returns {boolan} autoplay
   */
  autoplay() {
    return this.props.autoplay !== 'false';
  }
  /**
   * Denotes if we want this to loop on end of video
   *
   * @returns {boolan} true or false - should we loop?
   */
  autoLoop() {
    return this.props.loop === 'true';
  }

  //@todo - add info about this method. it is passed into the end card as a prop.
  changeVideoURL(newurl) {
    this.pauseVideo();
    this.videoplayer.src(newurl);
    // set src track corresponding to new movie //
    this.videoplayer.load();
    this.videoplayer.play();
  }
  showEndCard(b = true) {
    this.setState({
      showEndCard: b
    });
  }

  /**
  |--------------------------------------------------
  | Player events
  |--------------------------------------------------
  */

  /**
   * Pauses the video
   *
   * @returns {void}
   */
  pauseVideo() {
    if (this.videoplayer) {
      this.videoplayer.pause();
    }
  }

  /**
   * Plays the video
   *
   * @returns {void}
   */
  playVideo() {
    if (this.videoplayer) {
      let playPromise = this.videoplayer.play();
      playPromise.catch(() => {
        // poof ... error gone.
      });
    }
  }
  timeupdateHandler() {
    this.showEndCard(false);
  }
  /**
   * Video has ended.
   */
  videoEnded() {
    if (this.autoLoop()) {
      this.playVideo();
    }
    if (this.props.onVideoEndHandler) {
      this.props.onVideoEndHandler();
    }
    if (this.props.relatedVideos) {
      this.showEndCard(true);
    }
  }

  /**
   * video js script has loaded
   */
  videoScriptLoaded() {
    if (!this.props.src) {
      throwIfMissing('Video src');
      return;
    }

    const videoJsOptions = {
      autoplay: false,
      controls: true,
      poster: this.props.poster,
      sources: [
        {
          src: this.props.src,
          type: 'video/mp4'
        }
      ]
    };
    this.videoplayer = window.videojs(this.videonode, videoJsOptions, () => {
      this.updateVideoAttributes();
      this.setState({ videoplayer: this.videoplayer });
      this.addEvents();
    });
  }
  /**
   * Downloads the video script (if needed) and initializes the video API
   *
   * @returns {void}
   */
  initialize() {
    let src = 'https://vjs.zencdn.net/6.6.3/video.min.js';
    this.cachedScript = scriptCache({ videojs: src });
    this.cachedScript.videojs.onLoad(() => this.videoScriptLoaded());
  }

  /**
   * Updates the video element.
   */
  updateVideoAttributes() {
    if (this.videonode.getAttribute('muted') === '1') {
      return;
    }
    this.videonode.setAttribute('muted', '1');
    this.videonode.setAttribute('playsinline', '1');
    if (this.autoplay()) {
      this.videonode.setAttribute('autoplay', '1');
    }
  }
  /**
   * Returns a element selector
   *
   * @returns {string} selector for div holding player.
   */
  getVideoSelector() {
    this.selector
      ? this.selector
      : (this.selector = `video-js-${Math.floor(Math.random() * 100)}`);
    return this.selector;
  }

  /**
   * inView Call back
   *
   * @param {boolean} b - in the element we are tracking in the view port or not?
   */
  handleViewChange(b) {
    //console.log('handleViewChange', b)
    b ? this.playVideo() : this.pauseVideo();
  }

  /**
  |--------------------------------------------------
  | Life Cycle
  |--------------------------------------------------
  */

  /**
   * Lifecycle Method - on mount
   */
  componentDidMount() {
    this.initialize();
    this.updateVideoAttributes();
  }
  /**
   * destroy player on unmount
   */
  componentWillUnmount() {
    if (this.videoplayer) {
      this.videoplayer.pause();
      this.videoplayer.dispose();
      this.videoplayer = null;
    }
  }

  componentWillReceiveProps({ selected = false }) {
    // if this video component is is part of a video carousel it will have a selected prop.
    // This will allow us a way to play / pause external to the component.
    this.handleViewChange(selected);
  }

  /**
   * Lifecycle Method
   * @returns {component} - react element
   */
  render() {
    let poster = this.props.poster || '';
    return (
      <VideoJSStyle id={this.getVideoSelector()}>
        <div className="sixteen-by-nine" data-vjs-player>
          <video
            poster={poster}
            ref={video => (this.videonode = video)}
            className="video-js vjs-big-play-centered"
          />

          <InView
            bufferTop={30}
            target={`#${this.getVideoSelector()} `}
            handleViewChange={this.handleViewChange}
          />

          <VideoJsMetrics videoplayer={this.state.videoplayer} />
          {this.state.showEndCard && (
            <EndCard
              relatedVideos={this.props.relatedVideos}
              playAgain={this.playVideo}
              changeVideoURL={this.changeVideoURL}
            />
          )}
        </div>
      </VideoJSStyle>
    );
  }
}

Zumobivideovideojs.propTypes = {
  selected: PropTypes.bool,
  src: PropTypes.string.isRequired,
  autoplay: PropTypes.string,
  loop: PropTypes.string,
  onVideoEndHandler: PropTypes.func
};

export default Zumobivideovideojs;
