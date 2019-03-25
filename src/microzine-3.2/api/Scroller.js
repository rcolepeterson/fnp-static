import Eventifier from "microzine-3.2/base/EventifierStatic";
import MicrozineEvents from "microzine-3.2/helpers/MicrozineEvents";
import Properties from "microzine-3.2/helpers/MicrozineProperties";
import Page from "microzine-3.2/api/Page";

let _scrollTop = 0,
  _lastScrollTop = 0,
  _body = null,
  _isScrolling = false,
  _isArticleView = false,
  _isMainPageView = true;

class Scroller extends Eventifier {
  static _initialize() {
    console.log("we have scroller");

    if (Properties.isFriendlyIframe || document === "undefined") {
      let content = Page.getElementById("content");
      content.addEventListener("scroll", Scroller._onScroll, false);
      _body = content;
    } else {
      _body = document.body;
      document.addEventListener("scroll", Scroller._onScroll, false);
    }
  }

  static get scrollTop() {
    return _scrollTop;
  }

  static set scrollTop(scrollTop = 0) {
    if (!Properties.isFriendlyIframe) {
      window.scrollTo(0, scrollTop);
    }
    _body.scrollTop = scrollTop;
    _scrollTop = scrollTop;
  }

  static set articleVisibility(visibility) {
    _isArticleView = visibility;
    _isMainPageView = !visibility;
  }

  static _onScroll() {
    if (Properties.isFriendlyIframe) {
      _scrollTop = _body.scrollTop;
    } else {
      _scrollTop = window.pageYOffset;
    }
    if (!_isScrolling) {
      window.requestAnimationFrame(Scroller._scrolling);
    }
    _isScrolling = true;
  }

  static _scrolling() {
    if (Properties.isFriendlyIframe) {
      _scrollTop = _body.scrollTop;
    } else {
      _scrollTop = window.pageYOffset;
    }
    if (_lastScrollTop !== _scrollTop && _scrollTop >= 0) {
      if (_isMainPageView) {
        Scroller.dispatchEvent("mainPageScroll", { scrollTop: _scrollTop });
      } else if (_isArticleView) {
        Scroller.dispatchEvent("articleScroll", { scrollTop: _scrollTop });
      }
      Scroller.dispatchEvent("scroll", { scrollTop: _scrollTop });
      window.requestAnimationFrame(Scroller._scrolling);
    } else {
      _isScrolling = false;
      MicrozineEvents.dispatchEvent("scrollended", {});
    }
    _lastScrollTop = _scrollTop;
  }

  static smoothScrollTo(endY = 0, dur = 800) {
    let animationParams = {
      startY: _scrollTop,
      deltaY: endY - _scrollTop,
      startTime: Date.now(),
      totalTime: dur
    };

    window.requestAnimationFrame(() => {
      Scroller._animationTick(animationParams);
    });
  }

  static _animationTick({ startY, deltaY, startTime, totalTime }) {
    let elapsed = Date.now() - startTime;
    Scroller.scrollTop = Scroller.easeInCubic(
      elapsed,
      startY,
      deltaY,
      totalTime
    );
    if (elapsed < totalTime) {
      window.requestAnimationFrame(() => {
        Scroller._animationTick({ startY, deltaY, startTime, totalTime });
      });
    } else {
      return;
    }
  }

  static easeInCubic(t, b, c, d) {
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
  }

  /**
   * Returns the percenatge the page has scrolled.
   *
   * @returns {number} - amount scrolled.
   */
  static percentageScrolled() {
    let h = document.documentElement,
      b = document.body,
      st = "scrollTop",
      sh = "scrollHeight";

    if (Properties.isFriendlyIframe) {
      return (_body[st] / (_body[sh] - window.innerHeight)) * 100;
    }
    return ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
  }
}

MicrozineEvents.addEventListener(
  "microzineready",
  Scroller._initialize.bind(Scroller)
);

export default Scroller;
