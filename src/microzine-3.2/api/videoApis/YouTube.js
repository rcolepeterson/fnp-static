/*global YT*/

import MicrozineEvents from 'microzine-3.2/helpers/MicrozineEvents';
import VideoApi from 'microzine-3.2/base/VideoApi';

/**
 * Inline video player for YouTube videos
 *
 * @version 1.0
 */
class YouTube extends VideoApi {
  /**
   * Gets the duration of the video
   *
   * @returns {number}  - Duration of the video in seconds
   */
  get duration() {
    return typeof this._player.getDuration === 'function'
      ? this._player.getDuration()
      : -1;
  }

  /**
   * Gets the current position of the video
   *
   * @returns {number}  - Position of the video in seconds
   */
  get position() {
    return typeof this._player.getCurrentTime === 'function'
      ? this._player.getCurrentTime()
      : -1;
  }

  /**
   * Called when the YouTube scripts are ready; creates the inline video
   *
   * @param {string} videoID  - ID of the YouTube video
   * @returns {void}
   * @private
   */
  _onYouTubeIframeAPIReady(videoID) {
    this.initTrackingValues();

    MicrozineEvents.dispatchEvent('apiInitialized', { source: 'youtube' });
    let autoplay = this._properties.autoplay ? 1 : 0,
      id = this._properties.containerId
        ? this._properties.containerId
        : `video::${this._properties.id}`;

    this._player = new YT.Player(id, {
      videoId: videoID,
      events: {
        onStateChange: this._onPlayerStateChange.bind(this),
        onReady: this._onPlayerReady.bind(this)
      },
      playerVars: {
        rel: 0,
        autohide: 1,
        showinfo: 0,
        modestbranding: 1,
        autoplay: autoplay
      }
    });
  }

  /**
   * Called when the video is ready to play
   *
   * @returns {void}
   * @private
   */
  _onPlayerReady() {
    this._dispatcher('playerloaded', this._properties);
    if (this._properties.mute) {
      this._player.mute();
    }
  }

  /**
   * Called when the video changes state (play, pause, etc.)
   *
   * @param {EventArgs} e - State change event arguments
   * @returns {void}
   * @private
   */
  _onPlayerStateChange(e) {
    if (
      !this._properties.isPlaying &&
      (e.data === YT.PlayerState.PLAYING ||
        e.data === YT.PlayerState.PAUSED ||
        e.data === YT.PlayerState.BUFFERING)
    ) {
      // if we haven't set the start time yet, do it now (first play)
      if (!this._properties.startTime) {
        this._properties.startTime = Date.now();
        this._dispatcher('videostarted', this._properties);
        this.milestones = this.milestoneValues.slice();
      }

      this._properties.intervalStartTime = Date.now();
      this._properties.isPlaying = true;

      this._dispatcher('videoplaying', this._properties);
    } else if (
      this._properties.isPlaying &&
      (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED)
    ) {
      this._properties.isPlaying = false;
      this._properties.playingDuration +=
        Date.now() - this._properties.intervalStartTime;

      this._dispatcher('videopaused', this._properties);

      if (e.data === YT.PlayerState.ENDED) {
        this._dispatcher('videoended', this._properties);
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
  }

  fireMetric(value) {
    this._properties.quartileValue = value;
    this._dispatcher('videoReportQuartile', this._properties);
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
    this._properties.startTime = null;
  }

  /**
   * Downloads the YouTube script (if needed) and initializes the video API
   *
   * @returns {void}
   */
  initialize() {
    if (window.YT) {
      this._onYouTubeIframeAPIReady(this._properties.videoID);
    } else {
      let script = document.createElement('script'),
        firstScript = document.getElementsByTagName('script')[0];

      window.onYouTubeIframeAPIReady = this._onYouTubeIframeAPIReady.bind(
        this,
        this._properties.videoID
      );

      script.src = 'https://www.youtube.com/iframe_api';
      firstScript.parentNode.insertBefore(script, firstScript);
    }
  }
}

export default YouTube;
