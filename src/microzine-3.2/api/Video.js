import Eventifier from "microzine-3.2/base/EventifierStatic";
//import Logger from 'microzine-3.2/helpers/Logger';
import MicrozineEvents from "microzine-3.2/helpers/MicrozineEvents";
import Router from "microzine-3.2/api/Router";
//import VAPIBrightcove from 'microzine-3.2/api/videoApis/Brightcove';
import VAPIYouTube from "microzine-3.2/api/videoApis/YouTube";
import Properties from "microzine-3.2/helpers/MicrozineProperties";

let _initialized = false,
  _isFirstVideo = true,
  _videoQueue = [],
  _videos = {},
  _intervalID,
  _articleController;

class Video extends Eventifier {
  static get videos() {
    return _videos;
  }

  static get connectedArticleController() {
    return _articleController;
  }

  static set connectedArticleController(value) {
    _articleController = value;

    if ("addEventListener" in _articleController) {
      _articleController.addEventListener(
        "articlerendered",
        this._onArticleRendered.bind(this)
      );
    }
  }

  static _onArticleRendered({ article }) {
    let videoID =
        article && article.article_extras
          ? article.article_extras.id
          : undefined,
      source =
        article && article.article_extras
          ? article.article_extras.source
          : undefined;

    if (videoID && source) {
      this.registerVideo(videoID, source, null, true);
    }

    [].forEach.call(
      document.querySelectorAll('.main_content div[data-widget="videos"]'),
      widget => {
        let inlineId,
          inlineSource,
          videoUrl = widget.getAttribute("data-url"),
          imageUrl = widget.getAttribute("data-image-url");

        // check for YouTube
        inlineId = videoUrl.match(
          /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
        )[1];
        if (inlineId) {
          inlineSource = "youtube";

          let container = document.createElement("div");
          container.className = "video_inline";
          container.setAttribute("data-video-source", inlineSource);

          let standIn = document.createElement("div");
          standIn.className = "stand_in";

          let standInSpan = document.createElement("span");
          if (imageUrl) {
            standInSpan.style.backgroundImage = `url(${imageUrl}), url(${
              Properties.assetPath
            }/youtube.svg)`;
          }
          standIn.appendChild(standInSpan);
          container.appendChild(standIn);

          let video = document.createElement("div");
          video.id = `video::${inlineId}`;
          container.appendChild(video);

          widget.appendChild(container);

          this.registerVideo(inlineId, inlineSource, null, true);
        }
      }
    );
  }

  static _apiInitialized() {
    _initialized = true;

    while (_videoQueue.length) {
      let videoProps = _videoQueue.pop();
      videoProps.api.initialize();
    }
  }

  // while it would be cleaner to just dispatch the events from the specific API, it is possible that we may need to
  // change the event args from time to time, and it would be a pain to have to remember to update every single API
  static _eventDispatcher(eventName, properties) {
    switch (eventName) {
      case "videostarted":
        this.dispatchEvent("videostarted", {
          videoID: properties.videoID,
          startTime: properties.startTime,
          referringRoute: Router.currentRoute,
          playerType: properties.source
        });
        break;
      case "videoReportQuartile":
        this.dispatchEvent("videoReportQuartile", {
          videoID: properties.videoID,
          quartileValue: properties.quartileValue,
          referringRoute: properties.referringRoute
        });
        break;
      default:
        this.dispatchEvent(eventName, {
          videoID: properties.id
        });
        break;
    }
  }

  static _checkStartTimer() {
    if (Object.getOwnPropertyNames(_videos).length) {
      _intervalID = setInterval(this._onTick.bind(this), 500);
    }
  }

  static _checkPauseTimer() {
    if (!Object.getOwnPropertyNames(_videos).length) {
      clearInterval(_intervalID);
    }
  }

  static _onTick() {
    // not happy about nested if/else here, but unfortunately iOS 8 was puking on Symbol.iterator
    // in the for/of/continue loop, even with a polyfill...so here we are
    let keys = Object.getOwnPropertyNames(_videos);
    for (let i = 0; i < keys.length; i++) {
      let id = keys[i],
        props = _videos[id],
        dur = props.api.duration;

      if (dur < 0) {
        // noop; if the player and/or video aren't ready yet, don't bother trying to do any math
      } else {
        if (props.videoDuration !== dur) {
          props.videoDuration = dur;
        }

        let pct = 0,
          oldMaxPercent = props.maxPercent;

        if (props.videoDuration === 0) {
          // noop
        } else {
          pct = Math.round(
            Math.ceil((props.api.position / props.videoDuration) * 100)
          );
          props.maxPercent = Math.max(pct, props.maxPercent);

          if (props.maxPercent !== oldMaxPercent) {
            this.dispatchEvent("videoprogressupdated", {
              videoID: id,
              percent: props.maxPercent
            });
          }
        }
      }
    }
  }

  static _onContentUnloading(e) {
    let keys = Object.getOwnPropertyNames(_videos);
    for (let i = 0; i < keys.length; i++) {
      let id = keys[i];
      if (e === true || _videos[id].isArticle) {
        this.unregisterVideo(id);
      }
    }
  }

  static _initializeVideo(properties) {
    if (_initialized || _isFirstVideo) {
      properties.api.initialize();
      _isFirstVideo = false;
    } else {
      _videoQueue.push(properties);
    }
  }

  static registerVideo(videoID, source, id, isArticle, isAutoplay, isMuted) {
    let properties = {
      source: source,
      videoID: videoID,
      isPlaying: false,
      videoDuration: 0,
      playingDuration: 0,
      maxPercent: 0,
      id: id || videoID,
      containerId: id,
      isArticle: isArticle,
      autoplay: !!isAutoplay,
      mute: !!isMuted,
      referringRoute: Router.currentRoute
    };

    switch (source) {
      case "youtube":
        properties.api = new VAPIYouTube(
          properties,
          this._eventDispatcher.bind(this)
        );
        break;
      case "brightcove":
        // properties.api = new VAPIBrightcove(
        //   properties,
        //   this._eventDispatcher.bind(this)
        // );
        break;
      default:
        properties.api = new VAPIYouTube(
          properties,
          this._eventDispatcher.bind(this)
        );
    }

    _videos[properties.id] = properties;
    this._initializeVideo(properties);

    this._checkStartTimer();
    this.dispatchEvent("videoregistered", {
      videoID: properties.id,
      properties: properties
    });

    //return the API
    return properties.api;
  }

  static runUnloadEvents() {
    this._onContentUnloading(true);
  }

  static playVideo(id) {
    if (_videos[id] && _videos[id].api._player) {
      _videos[id].api._player.playVideo();
    }
  }

  static pauseVideo(id) {
    if (_videos[id] && _videos[id].api._player) {
      _videos[id].api._player.pauseVideo();
    }
  }

  static muteVideo(id) {
    if (_videos[id] && _videos[id].api._player) {
      _videos[id].api._player.mute();
    }
  }

  static isPlaying(id) {
    if (_videos[id]) {
      return _videos[id].isPlaying;
    }
  }

  static unregisterVideo(id) {
    let props = _videos[id],
      now = Date.now(),
      args = {
        videoID: id,
        endTime: now,
        didPlay: !!props.startTime // startTime is only set when the video is played the first time
      };

    if (props.isPlaying) {
      props.playingDuration += now - props.intervalStartTime;
    }

    delete _videos[id];
    delete props.api;

    this._checkPauseTimer();

    Object.assign(args, props);
    this.dispatchEvent("videounregistered", args);
  }
}

MicrozineEvents.addEventListener(
  "apiInitialized",
  Video._apiInitialized.bind(Video)
);
Router.addEventListener("routechange", Video._onContentUnloading.bind(Video));

export default Video;
