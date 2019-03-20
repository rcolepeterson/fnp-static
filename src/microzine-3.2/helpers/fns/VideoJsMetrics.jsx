import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import VideoMetrics from 'microzine-3.2/api/Video';
import Router from 'microzine-3.2/api/Router';

/**
 * Handles translating BrightCove video events into metrics.
 *
 */
class VideoJsMetrics extends Component {
  /**
   * Creates an instance of BrightCoveVideoMetrics.
   * @param {Object} props - prop object
   */
  constructor(props) {
    super(props);

    this.properties = {};
    this.properties.videoID;
    this.properties.starttime;
    this.properties.referringRoute = Router.currentRoute;
    this.properties.quartileValue = null;
    this.duration = null;
    this.videoStarted = false;
    this.milestoneValues = [25, 50, 75, 100];
    this.milestones = [];
  }
  /**
   * Add event listeners.
   * @returns {void}
   */
  addEvents() {
    this.videoplayer.on('timeupdate', this.timeupdateHandler.bind(this));
    this.videoplayer.on('ended', this.onPlayerEnded.bind(this));
    this.videoplayer.on('loadedmetadata', this.loadedmetadata.bind(this));
  }

  /**
   * Loads the Video Player meta data
   *
   */
  loadedmetadata() {
    this.dusration = this.videoplayer.duration;
    //supports both video js and bright cove. We will be passing this value as part of metrics obj.
    this.properties.videoID = this.videoplayer.mediainfo
      ? this.videoplayer.mediainfo.id
      : this.videoplayer
          .currentSource()
          .src.split('/')
          .pop()
          .split('#')[0]
          .split('?')[0];
    this.properties.source = this.videoplayer.mediainfo
      ? 'brightcove'
      : 'videojs';
  }
  /**
   * BrightCove player handler
   * Fires analytic events.
   * @returns {void}
   */
  timeupdateHandler() {
    if (!this.dusration) {
      return;
    }

    let percent = Math.ceil(
      (this.videoplayer.currentTime() / this.videoplayer.duration()) * 100
    );
    if (!this.videoStarted && percent > 1) {
      this.properties.startTime = Date.now();
      VideoMetrics._eventDispatcher('videostarted', this.properties);
      this.videoStarted = true;
      this.milestones = this.milestoneValues.slice();
    }

    if (percent >= this.milestones[0]) {
      this.fireMetric(this.milestones[0]);
      this.milestones.shift();
    }
  }
  /**
   * Fires milestone metric.
   * @param {int} value Milestone to fire
   */
  fireMetric(value) {
    this.properties.quartileValue = value;
    VideoMetrics._eventDispatcher('videoReportQuartile', this.properties);
  }
  /**
   * BrightCove player handler
   * Fires analytic events.
   * @returns {void}
   */
  onPlayerEnded() {
    VideoMetrics._eventDispatcher('videoended', this.properties);
    this.videoStarted = false;
  }
  /**
   * Lifecycle
   * On update define the target we are inspecting and start the tracking code.
   */
  componentDidUpdate() {
    this.videoplayer = this.props.videoplayer;
    if (this.videoplayer) {
      this.addEvents();
    }
  }

  /**
   * Renderless component.
   * https://kyleshevlin.com/renderless-components/
   *
   * @returns {null} - returns nothing.
   */
  render() {
    return null;
  }

  /**
   * Clean up
   * Fires analytic events.
   * @returns {void}
   */
  destroy() {
    //@todo
  }
}

export default VideoJsMetrics;
