import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import Properties from 'microzine-3.2/helpers/MicrozineProperties';
import InView from 'microzine-3.2/helpers/fns/InView';
import VideoJsMetrics from 'microzine-3.2/helpers/fns/VideoJsMetrics';
import scriptCache from 'microzine-3.2/api/ScriptCache';
import Logger from 'microzine-3.2/helpers/Logger';
//import { VideoJSStyle } from 'microzine-3.2/views/partials/video/Zumobivideovideojs';
import VideoJSStyle from './videoJSStyles.js';

const throwIfMissing = val => {
  Logger.error(`Zumobivideobrightcove: missing ${val}`);
};

/**
 * Zumobivideobrightcove
 * Brightcove video component.
 */
class Zumobivideobrightcove extends Component {
  /**
   * Constructor
   * @param {Object} props compnent properties
   */
  constructor(props) {
    super(props);
    this.handleViewChange = this.handleViewChange.bind(this);
    this.brightCoveLoaded = this.brightCoveLoaded.bind(this);
    this.videoplayer = null;
  }

  /**
   * Add event listeners.
   * @returns {void}
   */
  addEvents() {
    // this.videoplayer.on('timeupdate', this.timeupdateHandler.bind(this));
    // this.videoplayer.on('ended', this.onPlayerEnded.bind(this));
    // this.videoplayer.on('loadedmetadata', this.loadedmetadata.bind(this));
    this.videoplayer.on('ended', this.videoEnded.bind(this));
  }

  /**
   * inView Call back
   *
   * @param {boolean} b - in the element we are tracking in the view port or not?
   */
  handleViewChange(b) {
    b ? this.playVideo() : this.pauseVideo();
  }

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

  /**
   * Video has ended.
   */
  videoEnded() {
    if (this.autoLoop()) {
      this.playVideo();
    }
  }

  /**
   * brightcove script has loaded
   */
  brightCoveLoaded() {
    if (!this.props.dataVideoid) {
      throwIfMissing('Video id');
      return;
    }
    let id = 'vID' + this.props.dataVideoid;
    window.bc(document.getElementById(id));
    this.videoplayer = window.videojs(id);
    this.updateVideoAttributes();
    this.addEvents();
    this.setState({ videoplayer: this.videoplayer });
  }

  /**
   * Downloads the Brightcove script (if needed) and initializes the video API
   *
   * @returns {void}
   */
  initialize() {
    let src = `//players.brightcove.net/${
      Properties.microzineMetadata.brightcoveAccount
    }/${Properties.microzineMetadata.brightcovePlayerID}_default/index.min.js`;
    this.cachedScript = scriptCache({ brightcove: src });
    this.cachedScript.brightcove.onLoad(() => this.brightCoveLoaded());
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
  /**
   * Updates the video element.
   */
  updateVideoAttributes() {
    if (this.video.getAttribute('muted') === '1') {
      return;
    }
    this.video.setAttribute('muted', '1');
    this.video.setAttribute('playsinline', '1');
    if (this.autoplay()) {
      this.video.setAttribute('autoplay', '1');
    }
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
   * Lifecycle Method
   * destroy player on unmount
   */
  componentWillUnmount() {
    if (this.videoplayer) {
      this.videoplayer.pause();
      this.videoplayer.dispose();
      this.videoplayer = null;
    }
  }

  /**
   * Lifecycle Method
   * @returns {component} - react element
   */
  render() {
    return (
      <VideoJSStyle>
        <div class="sixteen-by-nine">
          <div data-vjs-player>
            <video
              id={`vID${this.props.dataVideoid}`}
              controls
              muted
              playsInline
              data-video-id={this.props.dataVideoid}
              className="video-js"
              ref={video => (this.video = video)}
            />
            {this.autoplay() && (
              <InView
                bufferTop={50}
                target={`#vID${this.props.dataVideoid}`}
                handleViewChange={this.handleViewChange}
              />
            )}
            <VideoJsMetrics videoplayer={this.state.videoplayer} />
          </div>
        </div>
      </VideoJSStyle>
    );
  }
}

export default Zumobivideobrightcove;
