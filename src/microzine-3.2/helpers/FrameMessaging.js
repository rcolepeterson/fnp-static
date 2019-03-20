import Logger from 'microzine-3.2/helpers/Logger';
import Utils from 'microzine-3.2/helpers/MicrozineUtils';

let _messages = {},
  _versionKey = 'framemessaging-1.0';

/**
 * Static module to communicate between different frames (for example, an ad creative containing the Microzine in an iframe).
 *
 * @version 1.0
 */
class FrameMessaging {
  /**
   * Handler to receive a message from another frame
   *
   * @param {Object} e  - Data sent from the other frame
   * @returns {void}
   * @private
   */
  static _receiveMessage(e) {
    let data = e.data || e.originalEvent.data;

    if (data.version === _versionKey && data.messageId) {
      this._fulfillMessage(data.messageId, data.value);
    }
  }

  /**
   * Executes the callback for a received message
   *
   * @param {string} messageId  - ID of the saved message
   * @param {Object} value      - Data to send to the callback
   * @returns {void}
   * @private
   */
  static _fulfillMessage(messageId, value) {
    let message = _messages[messageId];
    if (!message || message.isFulfilled) {
      return;
    }

    clearTimeout(message.timeoutId);
    message.isFulfilled = true;
    if (message.callback) {
      message.callback.call(null, value);
    }
  }

  /**
   * Fires when a sent message receives no response
   *
   * @param {string} messageId  - ID of the saved message
   * @returns {void}
   * @private
   */
  static _timeoutMessage(messageId) {
    let message = _messages[messageId];
    if (!message) {
      return;
    }

    message.didTimeout = true;
    this._fulfillMessage(messageId, null);
  }

  /**
   * Sends a new message to another frame.
   *
   * @param {Window} frame      - Frame to send the message to
   * @param {Object} message    - Data to send to the other frame
   * @param {Function} callback - Callback to fire if/when message is returned
   * @param {number=} timeout   - Override the number of ms before the message times out
   * @returns {void}
   */
  static beginMessage(frame, message, callback, timeout = 1000) {
    let messageId = Utils.createUUID();

    if (!frame || !frame.postMessage) {
      Logger.error(
        '`frame` must be a Window object that we can post the message to.'
      );
      return;
    }
    if (callback && typeof callback !== 'function') {
      Logger.error('`callback` must be a function, or undefined.');
      return;
    }
    message = message || null;
    timeout = Math.max(timeout, 0);

    let timeoutId = setTimeout(() => {
      this._timeoutMessage(messageId);
    }, timeout);

    _messages[messageId] = {
      messageId: messageId,
      frame: frame,
      message: message,
      callback: callback,
      timeout: timeout,
      timeoutId: timeoutId,
      isFulfilled: false,
      didTimeout: false
    };

    frame.postMessage(
      { version: this._versionKey, messageId: messageId, message: message },
      '*'
    );
  }
}

window.addEventListener(
  'message',
  FrameMessaging._receiveMessage.bind(FrameMessaging)
);

export default FrameMessaging;
