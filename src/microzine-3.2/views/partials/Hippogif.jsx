import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import Logger from 'microzine-3.2/helpers/Logger';
import Properties from 'microzine-3.2/helpers/MicrozineProperties';
import Utils from 'microzine-3.2/helpers/MicrozineUtils';

/**
 * Microzine front-page Hippogif component
 */
class Hippogif extends Component {
  /**
   * Creates a new Hippogif instance
   */
  constructor() {
    super();

    this.state = {
      imageURL: '',
      useInlineVideo: false,
      useCanvas: false
    };
  }

  /**
   * Gets if this browser supports the `<canvas>` element
   *
   * @returns {boolean} - `true` if `<canvas>` is supported, otherwise `false`
   */
  get supportsCanvas() {
    let elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  }

  /**
   * Gets if this browser supports the `<video>` element
   *
   * @returns {boolean} - `true` if `<video>` is supported, otherwise `false`
   */
  get supportsVideo() {
    let elem = document.createElement('video');
    return !!elem.canPlayType;
  }

  /**
   * Fires when the image or video is loaded
   *
   * @returns {void}
   */
  handleImageLoaded() {
    if (typeof this.props.onLoad === 'function') {
      this.props.onLoad();
    }
  }

  /**
   * Fires when loading an image fails; this can happen if the Hippogif image isn't on S3 yet
   *
   * @returns {void}
   */
  handleImageErrored() {
    if (this.state.useCanvas) {
      this.setState({
        useCanvas: false
      });
    } else {
      this.setState({
        imageURL: this.props.fallbackURL
      });
    }
  }

  /**
   * Fires when the Hippogif video is ready to play
   *
   * @param {EventArgs} e     - Event arguments
   * @returns {boolean|void}  - `false` to halt playback if the event has already fired, otherwise returns nothing
   */
  handleVideoCanPlay(e) {
    if (this.videoCanPlayThroughFired) {
      return false;
    }

    this.videoCanPlayThroughFired = true;
    this.handleImageLoaded(e);

    let video = e.target,
      canvas = e.target.previousElementSibling;

    if (canvas) {
      this.startVideoCanvasDraw(video, canvas);
    }
  }

  /**
   * Fires when there is an issue with video playback
   *
   * @param {EventArgs} e - Event arguments
   * @returns {void}
   */
  handleVideoError(e) {
    Logger.error('video error:', e);
  }

  /**
   * Fires when there is an issue loading a video
   *
   * @param {EventArgs} e - Event arguments
   * @returns {void}
   */
  handleVideoSourceError(e) {
    Logger.error('video source error:', e);
  }

  /**
   * Starts the timer to draw a new frame on every tick
   *
   * @param {VideoElement} video    - `<video>` source to pull from
   * @param {CanvasElement} canvas  - `<canvas>` element to draw to
   * @returns {void}
   */
  startVideoCanvasDraw(video, canvas) {
    let now = new Date();
    video.currentTime = 0;

    window.requestAnimationFrame(
      this.drawVideo.bind(
        this,
        video,
        canvas.getContext('2d'),
        now,
        video.duration,
        canvas.clientWidth,
        canvas.clientHeight
      )
    );
  }

  /**
   * Draws the current frame of the video on the canvas
   *
   * @param {VideoElement} video  - `<video>` source to pull from
   * @param {Context2d} context   - Drawing context of the `<canvas>`
   * @param {Date} start          - Time that the playback was initialized; used as a base value for determining which frame to draw next
   * @param {number} duration     - Duration of the video
   * @param {number} width        - Width of the video
   * @param {number} height       - Height of the video
   * @returns {void}
   */
  drawVideo(video, context, start, duration, width, height) {
    let pos = Utils.m2s(new Date() - start);
    if (pos >= duration) {
      start = new Date();
      pos = 0;
    }

    context.drawImage(video, 0, 0, width, height);
    video.currentTime = pos;
    window.requestAnimationFrame(
      this.drawVideo.bind(this, video, context, start, duration, width, height)
    );
  }

  /**
   * Fires before the Hippogif component first mounts
   *
   * @returns {void}
   */
  componentWillMount() {
    this.setState({
      imageURL: this.props.gifURL || this.props.fallbackURL,
      useInlineVideo:
        this.supportsVideo && (!Properties.isMobile || Properties.isAndroid),
      useCanvas:
        this.supportsCanvas && this.supportsVideo && !Properties.isAndroid
    });
  }

  /**
   * Fires after the Hippogif component first mounted
   *
   * @returns {void}
   */
  componentDidMount() {
    // TODO: ReactDOM replacement?
    let video = document.getElementById(btoa(this.props.vidURL));

    if (video) {
      let sources = video.querySelectorAll('source');

      video.addEventListener('canplay', this.handleVideoCanPlay.bind(this));
      video.addEventListener('error', this.handleVideoError.bind(this));
      for (let i = 0; i < sources.length; i++) {
        sources[i].addEventListener(
          'error',
          this.handleVideoSourceError.bind(this)
        );
      }

      if (this.state.useInlineVideo) {
        if (video.paused) {
          video.play();
        }
      } else if (this.state.useCanvas) {
        video.load();
      }
    }
  }

  /**
   * Renders the Hippogif
   *
   * @param {Object} props  - Properties set for this Hippogif
   * @param {Object} state  - Current state of this Hippogif
   * @returns {Component}   - Hippogif component
   */
  render(props, state) {
    let content = '';

    if (this.state.useInlineVideo) {
      this.videoCanPlayThroughFired = false;
      let videoID = btoa(props.vidURL);

      content = (
        <video
          className="hippogif_inlinevideo_container"
          width={props.imageWidth}
          height={props.imageHeight}
          muted
          autoplay
          loop
          preload="auto"
          id={videoID}
          webkit-playsinline>
          <source src={props.vidURL} type="video/mp4" />
        </video>
      );
    } else if (state.useCanvas) {
      this.videoCanPlayThroughFired = false;
      let videoID = btoa(props.vidURL);

      content = (
        <div className="hippogif_canvas_container">
          <canvas width={props.imageWidth} height={props.imageHeight} />
          <video muted preload="auto" id={videoID}>
            <source src={props.vidURL} type="video/mp4" />
          </video>
        </div>
      );
    } else {
      content = (
        <img
          onLoad={this.handleImageLoaded.bind(this)}
          onError={this.handleImageErrored.bind(this)}
          src={state.imageURL}
        />
      );
    }

    return (
      <div style={props.style} className={'hippogif_container'}>
        {content}
      </div>
    );
  }
}

export default Hippogif;
