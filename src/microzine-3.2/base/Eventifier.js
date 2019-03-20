/**
 * A helper class to extend when you need events in your class
 */
class Eventifier {
  /**
   * Add a new event listener
   *
   * @param {string} event      - Name of the event to listen for
   * @param {Function} listener - {Function} to call when the event is dispatched
   * @returns {void}
   */
  addEventListener(event, listener) {
    this.__listenerMap__ = this.__listenerMap__ || [];
    let __nextId__ = this.__listenerMap__.length;
    this.__eventifyEvents__ = this.__eventifyEvents__ || {};
    this.__eventifyEvents__[event] = this.__eventifyEvents__[event] || [];
    this.__listenerMap__.push(listener);
    this.__eventifyEvents__[event].push(listener);
    return __nextId__;
  }

  /**
   * Remove an existing event listener
   *
   * @param {string} event      - Name of the event
   * @param {Function} listener - {Function} to remove
   * @returns {void}
   */
  removeEventListener(event, listener) {
    let index;
    if (
      typeof listener === 'number' &&
      listener < this.__listenerMap__.length
    ) {
      listener = this.__listenerMap__[listener];
    }
    this.__eventifyEvents__ = this.__eventifyEvents__ || {};
    if (
      event in this.__eventifyEvents__ &&
      (index = this.__eventifyEvents__[event].indexOf(listener)) > -1
    ) {
      this.__eventifyEvents__[event].splice(index, 1);
    }
  }

  /**
   * Remove an existing event listener
   *
   * @param {string} event  - Name of the event to fire
   * @param {*} args        - Arguments to pass to the callback function
   * @returns {void}
   */
  dispatchEvent(event, args) {
    this.__eventifyEvents__ = this.__eventifyEvents__ || {};
    args = args || {};
    args.type = event;
    if (event in this.__eventifyEvents__) {
      // clone the array, in case one of the handlers removes itself before the next index is processed; it would
      // result in a skipped handler
      let toDispatch = this.__eventifyEvents__[event].slice(0);
      if (args && args.article && typeof args.article.clone === 'function') {
        let savedArticleRef = args.article;
        let newObj = JSON.parse(JSON.stringify(args));
        newObj.article = savedArticleRef.clone();
        toDispatch.forEach(l => {
          l.call(this, newObj);
        });
      } else {
        toDispatch.forEach(l => {
          l.call(this, JSON.parse(JSON.stringify(args)));
        });
      }
    }
  }
}

export default Eventifier;
