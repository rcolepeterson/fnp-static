/*global bc, videojs*/

import Properties from 'microzine-3.2/helpers/MicrozineProperties';
import VideoApi from 'microzine-3.2/base/VideoApi';

/**
 * Inline video player for Brightcove videos
 *
 * @version 1.0
 */
class Brightcove extends VideoApi {
  /**
   * Gets the duration of the video
   *
   * @returns {number}  - Duration of the video in seconds
   */
  get duration() {
    return typeof this._player.duration === 'function'
      ? this._player.duration()
      : -1;
  }

  /**
   * Gets the current position of the video
   *
   * @returns {number}  - Position of the video in seconds
   */
  get position() {
    return typeof this._player.currentTime === 'function'
      ? this._player.currentTime()
      : -1;
  }

  /**
   * Called when the Brightcove scripts are ready; creates the inline video
   *
   * @param {string} videoID  - ID of the Brightcove video
   * @returns {void}
   * @private
   */
  _onBrightcoveAPIReady(videoID) {
    let videoElem = document.getElementById(`videojs::${videoID}`),
      player;

    videoElem.setAttribute(
      'data-account',
      Properties.microzineMetadata.brightcoveAccount
    );
    videoElem.setAttribute(
      'data-player',
      Properties.microzineMetadata.brightcovePlayerID
    );
    videoElem.setAttribute('data-video-id', videoID);
    bc(videoElem);

    player = videojs(`videojs::${videoID}`);
    player.on('play', this._onPlayerStateChange.bind(this));
    player.on('pause', this._onPlayerStateChange.bind(this));
    player.on('ended', this._onPlayerEnded.bind(this));

    this._player = player;
  }

  /**
   * Called when the video changes state (play, pause, etc.)
   *
   * @returns {void}
   * @private
   */
  _onPlayerStateChange() {
    let isNowPlaying = !this._player.paused();

    if (!this._properties.isPlaying && isNowPlaying) {
      // if we haven't set the start time yet, do it now (first play)
      if (!this._properties.startTime) {
        this._properties.startTime = Date.now();
        this._dispatcher('videostarted', this._properties);
      }

      this._properties.intervalStartTime = Date.now();
      this._properties.isPlaying = true;

      this._dispatcher('videoplaying', this._properties);
    } else if (this._properties.isPlaying && !isNowPlaying) {
      this._properties.isPlaying = false;
      this._properties.playingDuration +=
        Date.now() - this._properties.intervalStartTime;

      this._dispatcher('videopaused', this._properties);
    }
  }

  /**
   * Called when the video is complete
   *
   * @returns {void}
   * @private
   */
  _onPlayerEnded() {
    this._dispatcher('videoended', this._properties);
  }

  /**
   * Downloads the Brightcove script (if needed) and initializes the video API
   *
   * @returns {void}
   */
  initialize() {
    if (typeof bc === 'function') {
      this._onBrightcoveAPIReady(this._properties.videoID);
    } else {
      let script = document.createElement('script'),
        firstScript = document.getElementsByTagName('script')[0];

      script.src = `//players.brightcove.net/${
        Properties.microzineMetadata.brightcoveAccount
      }/${Properties.microzineMetadata.brightcovePlayerID}_default/index.js`;
      script.onload = () =>
        this._onBrightcoveAPIReady(this._properties.videoID);
      firstScript.parentNode.insertBefore(script, firstScript);
    }
  }
}

export default Brightcove;
