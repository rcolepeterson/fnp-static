import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import InView from 'microzine-3.2/helpers/fns/InView';
import VideoMetrics from 'microzine-3.2/api/Video';
import Router from 'microzine-3.2/api/Router';
//import { VideoJSStyle } from 'microzine-3.2/views/partials/video/Zumobivideovideojs';
import VideoJSStyle from './videoJSStyles.js';

/**
 * Zumobivideoyoutube
 * Youtube video component.
 */
class Zumobivideoyoutube extends Component {
  /**
   * Constructor
   * @param {Object} props compnent properties
   */
  constructor(props) {
    super(props);
    this.handleViewChange = this.handleViewChange.bind(this);
    this.fireMetric = this.fireMetric.bind(this);
    this.videoplayer = null;
    this.properties = {};
    this.properties.videoID = this.props.dataVideoid;
    this.properties.starttime;
    this.properties.referringRoute = Router.currentRoute;
    this.properties.quartileValue = null;
    this.properties.source = 'youtube';
    this.videoStarted = false;
    this.milestoneValues = [25, 50, 75, 100];
    this.milestones = [];
  }

  /**
   * Gets the duration of the video
   *
   * @returns {number}  - Duration of the video in seconds
   */
  get duration() {
    return typeof this.videoplayer.getDuration === 'function'
      ? this.videoplayer.getDuration()
      : -1;
  }

  /**
   * Gets the current position of the video
   *
   * @returns {number}  - Position of the video in seconds
   */
  get position() {
    return typeof this.videoplayer.getCurrentTime === 'function'
      ? this.videoplayer.getCurrentTime()
      : -1;
  }

  /**
   * Denotes if we want the video play on load/
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
   * Downloads the YouTube script (if needed) and initializes the video API
   *
   * @returns {void}
   */
  initialize() {
    if (window.YT) {
      this._onYouTubeIframeAPIReady(this.props.dataVideoid);
    } else {
      let script = document.createElement('script'),
        firstScript = document.getElementsByTagName('script')[0];

      window.onYouTubeIframeAPIReady = this._onYouTubeIframeAPIReady.bind(
        this,
        this.props.dataVideoid
      );

      script.src = 'https://www.youtube.com/iframe_api';
      firstScript.parentNode.insertBefore(script, firstScript);
    }
  }
  /**
   * Returns a element selector
   *
   * @returns {string} selector for div holding player.
   */
  getVideoSelector() {
    return `vID${this.props.dataVideoid}`;
  }

  /**
   * Called when the YouTube scripts are ready; creates the inline video
   *
   * @param {string} videoID  - ID of the YouTube video
   * @returns {void}
   * @private
   */
  _onYouTubeIframeAPIReady() {
    this.videoplayer = new window.YT.Player(this.getVideoSelector(), {
      videoId: this.props.dataVideoid,
      events: {
        onReady: this.onPlayerReady.bind(this),
        onStateChange: this.onPlayerStateChange.bind(this)
      },
      playerVars: {
        rel: 0,
        autohide: 1,
        showinfo: 0,
        modestbranding: 1
      }
    });
    this.setState({ inViewTarget: `#${this.getVideoSelector()}` });
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
    if (this.videoplayer && this.videoplayer.pauseVideo) {
      this.videoplayer.pauseVideo();
    }
  }

  /**
   * Plays the video
   *
   * @returns {void}
   */
  playVideo() {
    if (this.videoplayer && this.videoplayer.playVideo) {
      this.videoplayer.playVideo();
    }
  }

  /**
   * Called when the video is ready to play
   *
   * @returns {void}
   * @private
   */
  onPlayerReady() {
    this.videoplayer.mute();
    if (this.autoplay()) {
      this.playVideo();
    }
  }

  /**
   * Called when the video changes state (play, pause, etc.)
   *
   * @param {EventArgs} e - State change event arguments
   * @returns {void}
   * @private
   */
  onPlayerStateChange(e) {
    if (
      e.data === window.YT.PlayerState.PLAYING ||
      e.data === window.YT.PlayerState.PAUSED ||
      e.data === window.YT.PlayerState.BUFFERING
    ) {
      // if we haven't set the start time yet, do it now (first play)
      if (!this.properties.startTime) {
        this.properties.startTime = Date.now();
        VideoMetrics._eventDispatcher('videostarted', this.properties);
        this.milestones = this.milestoneValues.slice();
      }
    }

    if (e.data === window.YT.PlayerState.PLAYING) {
      let playerTotalTime = this.duration;
      //You tube does not have an easy way to track the progress in realtime. Use this timer.
      this.mytimer = setInterval(() => {
        let playerCurrentTime = this.position;
        let percent = Math.ceil((playerCurrentTime / playerTotalTime) * 100);

        if (percent >= this.milestones[0]) {
          this.fireMetric(this.milestones[0]);
          this.milestones.shift();
        }
      }, 1000);
    } else if (this.mytimer) {
      clearTimeout(this.mytimer);
    }

    if (e.data === window.YT.PlayerState.ENDED) {
      this.videoEnded();
    }
  }
  /**
   * Fires milestone metric.
   * @param {int} value Milestone to fire
   */
  fireMetric(value) {
    this.properties.quartileValue = value;
    VideoMetrics._eventDispatcher('videoReportQuartile', this.properties);
    if (value === 100) {
      this.initTrackingValues();
    }
  }

  /**
   * Reset the tracking milestones and clear out start time.
   */
  initTrackingValues() {
    this.milestoneValues = [25, 50, 75, 100];
    this.milestones = [];
    this.properties.startTime = null;
  }
  /**
   * Video has started.
   */
  videoStarted() {}
  /**
   * Video has ended.
   * @returns {void}
   */
  videoEnded() {
    if (this.autoLoop()) {
      this.playVideo();
    }
  }
  /**
   * inView Call back
   *
   * @param {boolean} b - in the element we are tracking in the view port or not?
   */
  handleViewChange(b) {
    //console.log('hand', b);
    b ? this.playVideo() : this.pauseVideo();
  }
  /**
   * Lifecycle Method
   * @param {Object} nextProps object holding updated props.
   * @returns {boolean} Should component re render?
   */
  shouldComponentUpdate() {
    return false;
  }
  /**
   *
   * Lifecycle Method
   */
  componentDidMount() {
    this.initialize();
  }

  /**
   * destroy player on unmount
   */
  componentWillUnmount() {
    if (this.mytimer) {
      clearTimeout(this.mytimer);
    }

    if (this.videoplayer) {
      //this.pauseVideo();
      this.videoplayer.destroy();
      this.videoplayer = null;
    }
  }
  /**
   * Lifecycle Method
   * @returns {component} - React element
   */
  render() {
    return (
      <VideoJSStyle id={`wrapper-${this.getVideoSelector()}`}>
        <div class="sixteen-by-nine">
          <div id={this.getVideoSelector()} />
        </div>
        {this.autoplay() && (
          <InView
            target={`#wrapper-${this.getVideoSelector()}`}
            handleViewChange={this.handleViewChange}
          />
        )}
      </VideoJSStyle>
    );
  }
}

export default Zumobivideoyoutube;
