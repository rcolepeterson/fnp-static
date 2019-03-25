/* eslint-disable */
import Eventifier from "microzine-3.2/base/EventifierStatic";
//import Properties from 'microzine-3.2/helpers/MicrozineProperties';

let _height = 0;
let _width = 0;
let _pageElements = new Map();

class Page extends Eventifier {
  static _initialize() {
    if (typeof window !== `undefined`) {
      window.addEventListener("resize", this._handleResize.bind(this));
    }
    if (typeof document !== `undefined`) {
      _width = document.body.clientWidth;
      _height = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );

      _pageElements.set("wrapper", document.getElementById("wrapper"));
      _pageElements.set(
        "article_wrapper",
        document.getElementById("article_wrapper")
      );
      _pageElements.set(
        "article_close_wrapper",
        document.getElementById("article_close_wrapper")
      );
      _pageElements.set(
        "article_share",
        document.getElementById("article_share")
      );
      _pageElements.set("top_ctas", document.getElementById("top_ctas"));
      _pageElements.set("header", document.getElementById("header"));
      _pageElements.set("brand_header"),
        document.getElementById("brand_header");
      _pageElements.set("content", document.getElementById("content"));
      _pageElements.set("back_to_top", document.getElementById("back_to_top"));
    }
  }
  static get height() {
    return _height;
  }
  static get width() {
    return _width;
  }

  static get wrapperWidth() {
    return _width <= 700 ? _width : 700;
  }

  static getHeroHeight(width = _width) {
    if (width < 768) {
      return 170;
    } else if (width < 1440) {
      return 250;
    } else {
      return 320;
    }
  }

  static getElementById(id) {
    let el = _pageElements.get(id);
    if (!el) {
      el = document.getElementById(id);
      if (el) {
        _pageElements.set(id, el);
        return el;
      } else {
        return undefined;
      }
    } else {
      return el;
    }
  }
  static _handleResize(evt) {
    _width = document.body.clientWidth;
    _height = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
    this.dispatchEvent("resize", { height: _height, width: _width });
  }
}

Page._initialize(Page);

export default Page;
