import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import { debounce } from 'microzine-3.2/helpers/utils';
import Scroller from 'microzine-3.2/api/Scroller';

/**
 * InView
 *
 * Fires method when target element is in view
 * Fires method when target element is NOT in view
 *
 * @extends {Component}
 */
class InView extends Component {
  /**
   * Creates an instance of InView.
   * @param {*} props - properties
   */
  constructor(props) {
    super(props);
  }
  /**
   * Is element in the ViewPort?
   *
   * @param {elemet} el HTML element.
   * @returns {boolean} Is the el in view port?
   */
  componentInView(el) {
    if (!el || el === null) {
      return false;
    }
    let bufferTop = this.props.bufferTop || 0;
    let bounding = el.getBoundingClientRect();

    return (
      bounding.top >= bufferTop &&
      bounding.left >= 0 &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  /**
   * Lifecycle
   * Define handler.
   */
  componentDidMount() {
    if (!this.props.handleViewChange) {
      /*eslint-disable no-console*/
      console.warn('You are using InView, but did not pass a handler.');
      /*eslint-enable no-console*/
    }
    this.handleViewChange = this.props.handleViewChange;
    this.createObserver(document.querySelector(this.props.target));
  }

  /**
   * Lifecycle
   * Remove stuff.
   */
  componentWillUnmount() {
    Scroller.removeEventListener('scroll', this.scrollListener);
  }
  /**
   * Wrap element tracking method in debounce.
   * Init scroller.
   * @param {element} target - element to track.
   */
  createObserver(target) {
    if (this.scrollListener) {
      Scroller.removeEventListener('scroll', this.scrollListener);
    }
    let myEfficientFn = debounce(() => {
      this.handleViewChange(this.componentInView(target));
    }, 250);

    this.scrollListener = myEfficientFn;
    Scroller.addEventListener('scroll', myEfficientFn);
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
}

export default InView;
