import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import Video from 'microzine-3.2/api/Video';

class InlineVideo extends Component {
  constructor() {
    super();
    this.isProgramatic = false;
    this.userInitiated = false;
    this.wasPlaying = false;
  }

  componentDidMount() {
    Video.addEventListener('videopaused', this.videoPaused.bind(this));
    Video.addEventListener('videoplaying', this.videoPlaying.bind(this));
    Video.addEventListener('videoended', this.videoEnded.bind(this));
    switch (this.props.source) {
      case 'youtube': {
        //from http://stackoverflow.com/questions/10591547/how-to-get-youtube-video-id-from-url
        let id = this.props.url.match(
          /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
        )[1];
        //parameters: (videoID, source, id, isArticle, autoplay, muted)
        this.videoAPI = Video.registerVideo(
          id,
          this.props.source,
          this.props.containerID,
          false,
          true,
          true
        );
        break;
      }
    }
  }

  videoPaused(e) {
    if (e.videoID !== this.props.containerID) {
      return;
    }
    if (this.isProgramatic) {
      this.userInitiated = false;
    } else {
      this.userInitiated = true;
    }
    this.isProgramatic = false;
  }

  videoEnded(e) {
    if (e.videoID !== this.props.containerID) {
      return;
    }
    this.wasPlaying = false;
  }

  videoPlaying(e) {
    if (e.videoID !== this.props.containerID) {
      return;
    }
    this.wasPlaying = true;
  }

  playVideo() {
    Video.playVideo(this.props.containerID);
  }

  isPlaying() {
    return Video.isPlaying(this.props.containerID);
  }

  pauseVideo() {
    this.isProgramatic = true;
    this.userInitiated = false;
    Video.pauseVideo(this.props.containerID);
  }

  muteVideo() {
    Video.muteVideo(this.props.containerID);
  }

  render(props) {
    return (
      <div>
        <div id={props.containerID} />
      </div>
    );
  }
}

export default InlineVideo;
