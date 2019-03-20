/* eslint-disable no-console */

import Properties from 'microzine-3.2/helpers/MicrozineProperties';
import Utils from 'microzine-3.2/helpers/MicrozineUtils';

let _logLevels = {
  silly: 10,
  log: 20,
  info: 30,
  warn: 40,
  error: 50
};

let _currentLogLevel =
    Properties && Properties.env === 'production'
      ? _logLevels.error
      : _logLevels.log,
  _groups = [],
  _timers = {};

/**
 * Generic logger class that logs messages to the console, and could be expanded to log to other sources
 */
class Logger {
  /**
   * Gets an enumeration of all available log levels
   *
   * @returns {Enum}  - Enumeration of log levels
   */
  static get LOG_LEVEL() {
    return _logLevels;
  }

  /**
   * Gets the current log level
   *
   * @returns {string}  - Current log level
   */
  static get logLevel() {
    let keys = Object.getOwnPropertyNames(_logLevels);
    return keys.find(k => _currentLogLevel === _logLevels[k]);
  }

  /**
   * Sets a new log level
   *
   * @param {string} value  - Desired log level
   */
  static set logLevel(value) {
    let keys = Object.getOwnPropertyNames(_logLevels);
    if (keys.some(k => _logLevels[k] === value)) {
      _currentLogLevel = value;
    }
  }

  /**
   * Indents a group of messages in the log
   *
   * @param {Array<*>} messages - Messages to indent
   * @returns {void}
   * @private
   */
  static _indentGroups(messages) {
    let spaces = '   '.repeat(_groups.length);
    messages.forEach(msg => (typeof msg === 'string' ? spaces + msg : msg));
  }

  /**
   * Logs messages to the console and/or the Zbi SDK
   *
   * @param {Array<*>} messages  - Messages to log
   * @param {string} level       - Level to log messages at
   * @returns {void}
   * @private
   */
  static _doLogMessages(messages, level) {
    if (_currentLogLevel <= _logLevels[level]) {
      let consoleFunc = (console[level] || console.log).bind(console);
      if (consoleFunc) {
        messages.unshift(`*${level.toUpperCase()}*`);
        this._indentGroups(messages);
        consoleFunc(...messages);
      }

      if (Properties.isSDK) {
        window.Api.debugLog(...messages);
      }
    }
  }

  /**
   * Logs a "silly"-level message
   *
   * @param {...*} messages - Series of items to log
   * @returns {void}
   */
  static silly(...messages) {
    this._doLogMessages(messages, 'silly');
  }

  /**
   * Logs a "log"-level message
   *
   * @param {...*} messages - Series of items to log
   * @returns {void}
   */
  static log(...messages) {
    this._doLogMessages(messages, 'log');
  }

  /**
   * Logs a "info"-level message
   *
   * @param {...*} messages - Series of items to log
   * @returns {void}
   */
  static info(...messages) {
    this._doLogMessages(messages, 'info');
  }

  /**
   * Logs a "warn"-level message
   *
   * @param {...*} messages - Series of items to log
   * @returns {void}
   */
  static warn(...messages) {
    this._doLogMessages(messages, 'warn');
  }

  /**
   * Logs a "error"-level message
   *
   * @param {...*} messages - Series of items to log
   * @returns {void}
   */
  static error(...messages) {
    this._doLogMessages(messages, 'error');
  }

  /**
   * Asserts that an expression is true and logs an error if it is not
   *
   * @param {*} expr        - Expression that resolves to a truthy/falsy result
   * @param {...*} messages - Series of items to log
   * @returns {void}
   */
  static assert(expr, ...messages) {
    if (!expr) {
      this._doLogMessages(messages, 'error');
    }
  }

  /**
   * Creates a new logging group
   *
   * @param {string} label  - Name of the logging group to start
   * @returns {void}
   */
  static group(label) {
    if (typeof label !== 'string') {
      return; // label must be a string
    }

    if (_groups.includes(label)) {
      return; // group already exists
    }

    let messages = [`\u{1F4C2} GROUP ${label} STARTED`];
    this._indentGroups(messages);
    this.info(this, ...messages);

    _groups.push(label);
  }

  /**
   * Ends a logging group
   *
   * @param {string} label  - Name of the logging group to end
   * @returns {void}
   */
  static groupEnd(label) {
    let index = _groups.indexOf(label);
    if (index === -1) {
      return; // group doesn't exist, can't end
    }

    _groups.splice(index, 1);

    let messages = [`\u{1F4C2} GROUP ${label} ENDED`];
    this._indentGroups(messages);
    this.info(this, ...messages);
  }

  /**
   * Creates a new timer
   *
   * @param {string} label  - Name of the timer to start
   * @returns {void}
   */
  static time(label) {
    if (typeof label !== 'string') {
      return; // label must be a string
    }

    if (_timers[label]) {
      return; // timer already exists
    }

    let timer = (_timers[label] = {
      start: new Date()
    });

    let messages = [
      `\u231B TIMER ${label} STARTED AT: ${timer.start.toLocaleTimeString()}`
    ];
    this._indentGroups(messages);
    this.info(this, ...messages);
  }

  /**
   * Logs the duration of an existing timer
   *
   * @param {string} label  - Name of the timer
   * @returns {void}
   */
  static timeShow(label) {
    let timer = _timers[label];

    if (!timer) {
      return; // timer doesn't exist, can't show
    }

    let now = new Date(),
      messages = [
        `\u231B TIMER ${label} ELAPSED FROM LAST: ${Utils.m2s(
          now - (timer.lastShow || timer.start)
        )}, FROM START: ${Utils.m2s(now - timer.start)}`
      ];
    this._indentGroups(messages);
    this.info(this, ...messages);

    timer.lastShow = now;
  }

  /**
   * Ends a timer
   *
   * @param {string} label  - Name of the timer to end
   * @returns {void}
   */
  static timeEnd(label) {
    let timer = _timers[label];

    if (!timer) {
      return; // timer doesn't exist, can't end
    }

    this.timeShow(label);
    let messages = [
      `\u231B TIMER ${label} ENDED AT: ${new Date().toLocaleTimeString()}`
    ];
    this._indentGroups(messages);
    this.info(this, ...messages);

    delete _timers[label];
  }
}

export default Logger;
