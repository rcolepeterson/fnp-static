/**
 * Base class for the inline video APIs
 *
 * @version 1.0
 */
class VideoApi {
  /**
   * Instantiates a new video player
   *
   * @param {Object} properties   - Options to send to the video player
   * @param {Function} dispatcher - Callback to the main video event dispatcher
   */
  constructor(properties, dispatcher) {
    this._properties = properties;
    this._dispatcher = dispatcher;
    this._player = null;
  }

  /**
   * Gets the duration of a video; *must* be implemented in the child class
   *
   * @throws {Error}
   */
  get duration() {
    throw new Error('`duration` must be implemented in the child class');
  }

  /**
   * Gets the current position of a video; *must* be implemented in the child class
   *
   * @throws {Error}
   */
  get position() {
    throw new Error('`position` must be implemented in the child class');
  }

  /**
   * Initializes a video API; *must* be implemented in the child class
   *
   * @throws {Error}
   * @returns {void}
   */
  initialize() {
    throw new Error('`initialize()` must be implemented in the child class');
  }
}

export default VideoApi;
