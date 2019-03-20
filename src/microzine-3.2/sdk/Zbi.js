import Logger from 'microzine-3.2/helpers/Logger';
import Metrics from 'microzine-3.2/api/Metrics';
import SemVer from 'microzine-3.2/helpers/SemVer';
import Utils from 'microzine-3.2/helpers/MicrozineUtils';
import Video from 'microzine-3.2/api/Video';

let _nextRequestID = 0,
  _queuedRequests = [],
  _isSDKReady = true,
  _callbackData = {};

/**
 * Static class that enables interop between a Microzine and the native SDK
 */
class Zbi {
  /**
   * Creates the next unique request ID
   *
   * @returns {string} - Request ID
   */
  static get nextRequestID() {
    return `rid_${++_nextRequestID}`;
  }

  /**
   * Listens for metrics events and calls the correct SDK interop method
   *
   * @param {EventArgs} e - Metrics event args
   * @returns {void}
   * @private
   */
  static _handleMetricsEvent(e) {
    let params = e.event;

    switch (params.metric_name) {
      case 'content_started':
        this.reportContentItemLoaded(params);
        break;
      case 'interaction_event':
        this.reportCustomMetric(params);
    }
  }

  /**
   * Listens for video events and calls the correct SDK interop method
   *
   * @param {EventArgs} e - Video event args
   * @returns {void}
   * @private
   */
  static _handleVideoEvent(e) {
    switch (e.type) {
      case 'videoplaying':
        this.reportVideoPlaying(e.videoID);
        break;
      case 'videopaused':
        this.reportVideoPaused(e.videoID);
        break;
      case 'videoended':
        this.reportVideoEnded(e.videoID);
        break;
      case 'videoprogressupdated':
        this.reportVideoPlaybackProgressUpdated(e.videoID, e.percent);
        break;
    }
  }

  /**
   * Gets the next request ID and sets up the Promise resolve/reject callbacks
   *
   * @returns {string} - The request ID
   * @private
   */
  static _getRequestID() {
    let id = this.nextRequestID,
      obj = {};

    obj.promise = new Promise((resolve, reject) => {
      obj.resolve = resolve;
      obj.reject = reject;
    });

    this._callbackData[id] = obj;

    return id;
  }

  /**
   * Turns a hash into a query string to use in interop
   *
   * @param {Object} opts - Hash to convert
   * @returns {string}    - Query string
   * @private
   */
  static _createParams(opts) {
    let qs = Object.getOwnPropertyNames(opts)
      .map(k => {
        let v = opts[k];
        return `${encodeURIComponent(k)}=${encodeURIComponent(
          typeof v === 'string' || typeof v === 'number' ? v : JSON.stringify(v)
        )}`;
      })
      .join('&');

    return qs.length ? `?${qs}` : '';
  }

  /**
   * Queues an async interop command (one that has a callback)
   *
   * @param {string} command  - Native command to call
   * @param {Object=} opts    - Parameter hash to send
   * @returns {Promise}       - Promise that will fulfill once a response comes back from the SDK
   * @private
   */
  static _executeAsync(command, opts = {}) {
    opts.requestId = this._getRequestID();

    this._execute(command, opts);

    return _callbackData[opts.requestId].promise;
  }

  /**
   * Queues a syncronous interop command
   *
   * @param {string} command  - Native command to call
   * @param {Object=} opts    - Parameter hash to send
   * @returns {void}
   * @private
   * @private
   */
  static _execute(command, opts = {}) {
    _queuedRequests.push({
      command: command,
      opts: opts
    });
    this._sendNextRequest();
  }

  /**
   * Checks to see if the SDK is ready to accept another command and if there is one queued up; if so, send the next one
   *
   * @returns {void}
   * @private
   */
  static _sendNextRequest() {
    if (_isSDKReady && _queuedRequests.length) {
      _isSDKReady = false;
      let nextRequest = _queuedRequests.shift(),
        doLogRequest = !nextRequest.command.startsWith('DebugConsoleCommand');

      if (window.WebClientBridge) {
        // <--- Android SDK uses this
        let stringifiedOpts = JSON.stringify(nextRequest.opts);

        // don't log if this is a logging statment...inception
        if (doLogRequest) {
          Logger.log(`TO BRIDGE: ${nextRequest.command}, ${stringifiedOpts}`);
        }
        window.WebClientBridge.exec(nextRequest.command, stringifiedOpts);
      } else {
        let apiLocation = `zz://${nextRequest.command}${this._createParams(
          nextRequest.opts
        )}`;

        // don't log if this is a logging statment...inception
        if (doLogRequest) {
          Logger.log(`TO BRIDGE: ${apiLocation}`);
        }
        window.location = apiLocation;
      }
    }
  }

  /**
   * Initializes the Zbi/SDK interop and finds the SDK version
   *
   * @returns {Zbi} - Zbi
   */
  static initialize() {
    let version = window.zz_zbi_sdk_version; // special property set by the SDK that exposes the version

    if (version) {
      Utils.sdkVersion = new SemVer(version);
      Logger.info(`Native SDK version: ${Utils.sdkVersion}`);

      Metrics.addEventListener(
        'eventqueued',
        this._handleMetricsEvent.bind(this)
      );
      Video.addEventListener('videoplaying', this._handleVideoEvent.bind(this));
      Video.addEventListener('videopaused', this._handleVideoEvent.bind(this));
      Video.addEventListener('videoended', this._handleVideoEvent.bind(this));
      Video.addEventListener(
        'videoprogressupdated',
        this._handleVideoEvent.bind(this)
      );
    } else {
      Logger.info('No native SDK found.');
    }

    return this;
  }

  /**
   * Tells Zbi that the SDK is ready for the next request
   *
   * @returns {void}
   */
  static queueReady() {
    _isSDKReady = true;
    this._sendNextRequest();
  }

  /**
   * Finds and calls the callback when a response comes back from the SDK
   *
   * @param {string} id   - Request ID
   * @param {*} response  - Response from the SDK
   * @returns {void}
   */
  static clientCallback(id, response) {
    Logger.log(`FROM BRIDGE (${id}): ${response}`);

    let cbData = _callbackData[id],
      json;

    if (!cbData) {
      Logger.warn(
        `Got response from bridge but no callback data found for id ${id}.`
      );
      return;
    }

    try {
      json = JSON.parse(decodeURIComponent(response));
      cbData.resolve(json);
    } catch (ex) {
      Logger.error('Could not parse JSON from response.');
      cbData.reject(ex);
    }
  }

  /**
   * Finds and calls the callback when a error comes back from the SDK
   *
   * @param {string} id   - Request ID
   * @param {*} response  - Response from the SDK
   * @returns {void}
   */
  static clientErrorCallback(id, response) {
    let cbData = _callbackData[id],
      json;

    if (!cbData) {
      Logger.error(
        `Got error from bridge but no callback data found for id ${id}.`
      );
      return;
    }

    try {
      json = JSON.parse(decodeURIComponent(response));
      cbData.reject(new Error(json.message));
    } catch (ex) {
      Logger.error('Could not parse JSON from response.');
      cbData.reject(ex);
    }
  }

  /**
   * Calls the SDK to get the SDK version
   *
   * @returns {Promise} - Resolves with the response from the SDK
   */
  static getSDKVersion() {
    let opts = {};

    Logger.log('Bridge command: ZBiMCommand.getSDKVersion', opts);
    return this._executeAsync('ZBiMCommand.getSDKVersion', opts);
  }

  /**
   * Calls the SDK to get all articles for a channel
   *
   * @param {string} channelName  - Channel to query
   * @returns {Promise}           - Resolves with the response from the SDK
   */
  static getArticlesForChannel(channelName) {
    let opts = {
      channelId: channelName
    };

    Logger.log('Bridge command: DataCommand.getArticlesForChannel', opts);
    return this._executeAsync('DataCommand.getArticlesForChannel', opts);
  }

  /**
   * Calls the SDK to get resources (articles) that match the query
   *
   * @param {Array<string>=} attributes - List of attributes that the resources must contain
   * @param {number=} maxCount          - Maximum number of resources to return in the query
   * @param {number=} offset            - Number of resources to skip
   * @param {boolean=} partialContent   - Um...TBD, no idea what this was supposed to be for :(
   * @returns {Promise}                 - Resolves with the response from the SDK
   */
  static getResourcesWithAttributes(
    attributes = [],
    maxCount = 20,
    offset = 0,
    partialContent = false
  ) {
    let opts = {
      attributes: attributes,
      maxCount: maxCount,
      offset: offset,
      partialContent: partialContent
    };

    Logger.log('Bridge command: ZBiMCommand.getResourcesWithAttributes', opts);
    return this._executeAsync('ZBiMCommand.getResourcesWithAttributes', opts);
  }

  /**
   * Calls the SDK to get a resource matching a specific URI
   *
   * @param {string} uri                - URI of the resource
   * @param {boolean=} partialContent   - Um...TBD, no idea what this was supposed to be for :(
   * @returns {Promise}                 - Resolves with the response from the SDK
   */
  static getResourceForURI(uri, partialContent = false) {
    let opts = {
      uri: uri,
      partialContent: partialContent
    };

    Logger.log('Bridge command: ZBiMCommand.getResourceForURI', opts);
    return this._executeAsync('ZBiMCommand.getResourceForURI', opts);
  }

  /**
   * Calls the SDK to get the user profile
   *
   * @param {string} userId - User's ID
   * @returns {Promise}     - Resolves with the response from the SDK
   */
  static getUserProfile(userId) {
    let opts = {};

    if (userId) {
      opts.userId = userId;
    }

    Logger.log('Bridge command: ZBiMCommand.getUserProfile', opts);
    return this._executeAsync('ZBiMCommand.getUserProfile', opts);
  }

  /**
   * Sends the allowed phone orientation(s) to the SDK
   *
   * @param {...string} orientations  - Orientations that the SDK should allow ('portrait', 'landscape')
   * @returns {void}
   */
  static setOrientation(...orientations) {
    let allowedOrientations = ['portrait', 'landscape'];

    if (
      orientations.length &&
      orientations.every(o => allowedOrientations.includes(o))
    ) {
      let opts = {
        supportedOrientations: orientations
      };

      Logger.log('Bridge command: ZBiMCommand.setOrientation', opts);
      this._execute('ZBiMCommand.setOrientation', opts);
    }
  }

  /**
   * Informs the SDK that a content item has been loaded
   *
   * @param {Object=} params  - Event parameters to send
   * @returns {void}
   */
  static reportContentItemLoaded(params = {}) {
    let opts = {
      uri: params._sdkUri,
      contentId: params.content_id,
      contentGroup: params.content_group
    };

    Logger.log('Bridge command: ZBiMCommand.reportContentItemLoaded', opts);
    this._execute('ZBiMCommand.reportContentItemLoaded', opts);
  }

  /**
   * Informs the SDK that a video started playing
   *
   * @param {string} videoId  - ID of the video
   * @returns {void}
   */
  static reportVideoPlaying(videoId) {
    let opts = {
      videoId: videoId
    };

    Logger.log('Bridge command: ZBiMCommand.reportVideoPlaying', opts);
    this._execute('ZBiMCommand.reportVideoPlaying', opts);
  }

  /**
   * Informs the SDK that a video has been paused
   *
   * @param {string} videoId  - ID of the video
   * @returns {void}
   */
  static reportVideoPaused(videoId) {
    let opts = {
      videoId: videoId
    };

    Logger.log('Bridge command: ZBiMCommand.reportVideoPaused', opts);
    this._execute('ZBiMCommand.reportVideoPaused', opts);
  }

  /**
   * Informs the SDK that a video has ended
   *
   * @param {string} videoId  - ID of the video
   * @returns {void}
   */
  static reportVideoEnded(videoId) {
    let opts = {
      videoId: videoId
    };

    Logger.log('Bridge command: ZBiMCommand.reportVideoEnded', opts);
    this._execute('ZBiMCommand.reportVideoEnded', opts);
  }

  /**
   * Informs the SDK that the user has watched more of a video
   *
   * @param {string} videoId          - ID of the video
   * @param {number} percentCompleted - How far into the video we are
   * @returns {void}
   */
  static reportVideoPlaybackProgressUpdated(videoId, percentCompleted) {
    let opts = {
      videoId: videoId,
      percentCompleted: percentCompleted
    };

    Logger.log(
      'Bridge command: ZBiMCommand.reportVideoPlaybackProgressUpdated',
      opts
    );
    this._execute('ZBiMCommand.reportVideoPlaybackProgressUpdated', opts);
  }

  /**
   * Informs the SDK about a generic event
   *
   * @param {Object=} params  - Event parameters to send
   * @returns {void}
   */
  static reportCustomMetric(params = {}) {
    Logger.log('Bridge command: ZBiMCommand.reportCustomMetric', params);
    this._execute('ZBiMCommand.reportCustomMetric', params);
  }

  /**
   * Sends debug messages to the SDK
   *
   * @param {...*} messages - Items to log
   * @returns {void}
   */
  static debugLog(...messages) {
    let opts = {
      args: messages
    };

    this._execute('DebugConsoleCommand.log', opts);
  }

  /**
   * Sends error messages to the SDK
   *
   * @param {...*} messages - Items to log as an error
   * @returns {void}
   */
  static debugError(...messages) {
    let opts = {
      args: messages
    };

    this._execute('DebugConsoleCommand.error', opts);
  }

  /**
   * Tells the SDK that the user requested that the Microzine be closed
   *
   * @param {bool=} isAnimated  - If the close should have the option of being animated
   * @returns {Promise}         - Resolves with the response from the SDK
   */
  static closeContentHub(isAnimated = false) {
    let opts = {
      animated: isAnimated
    };

    Logger.log('Bridge command: ZBiMCommand.closeContentHub', opts);
    return this._executeAsync('ZBiMCommand.closeContentHub', opts);
  }
}

export default Zbi;
