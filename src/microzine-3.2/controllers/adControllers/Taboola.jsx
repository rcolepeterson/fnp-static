import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import MicrozineEvents from 'microzine-3.2/helpers/MicrozineEvents';
import Properties from 'microzine-3.2/helpers/MicrozineProperties';
import Router from 'microzine-3.2/api/Router';
import styled from 'styled-components';

let _isFirstPageLoad = true;

const Wrapper = styled.div`
  width: 90%;
  margin-top: 40px;
  max-width: 992px;
  margin: 0 auto;
  padding: 15px;
  z-index: 1;
  position: relative;
`;

/**
 * Documentation here: https://zumobi.atlassian.net/wiki/spaces/3AS/pages/106594306/Taboola
 *
 * This was most recently used for Tmobile, the placement was either on
 * the homepage or article details page. You'll need a new one from ad ops.
 * here's an example of how it was place in tmobile:
 * <Taboola.component placement="home" />
 *
 * if this has been updated to be more flexible (it should) then the above may not be correct anymore.
 *
 * @class Taboola
 * @extends {Component}
 */

class Taboola extends Component {
  constructor() {
    super();
  }
  componentWillMount() {
    if (!window._taboola) {
      window._taboola = [];

      !(function(e, f, u, i) {
        if (!document.getElementById(i)) {
          e.async = 1;
          e.src = u;
          e.id = i;
          f.parentNode.insertBefore(e, f);
        }
      })(
        document.createElement('script'),
        document.getElementsByTagName('script')[0],
        '//cdn.taboola.com/libtrc/zumobi/loader.js',
        'tb_loader_script'
      );
      if (window.performance && typeof window.performance.mark === 'function') {
        window.performance.mark('tbl_ic');
      }
    }
  }

  componentDidMount() {
    window._taboola = window._taboola || [];

    if (!(this.props.placement === 'home' && _isFirstPageLoad)) {
      this._fireTaboolaNewPageNotify();
    }
    this._fireCommonTaboolaParams();
    _isFirstPageLoad = true;

    MicrozineEvents.addEventListener('microzineready', () => {
      Router.addEventListener('routechange', e => {
        if (Router.getPageType(e.newRoute) === 'hub') {
          this._fireTaboolaNewPageNotify();
          this._fireCommonTaboolaParams();
          _taboola.push({ flush: true });
        }
      });
    });
  }

  render() {
    return (
      <Wrapper>
        <div
          id={
            this.props.placement === 'article'
              ? 'taboola-below-article-thumbnails'
              : 'taboola-home-page'
          }
        />
      </Wrapper>
    );
  }

  _buildCanonicalUrl() {
    if (!Object.getOwnPropertyNames(Router.currentRoute).length) {
      return `${location.origin}/${location.pathname}#${Properties.brand}/${
        Properties.appVersion
      }`;
    }
    return `${location.origin}/${
      location.pathname
    }#${Router.currentRoute.route.join('/')}`;
  }

  _fireTaboolaNewPageNotify() {
    let taboolaParams = { notify: 'newPageLoad' };
    _taboola.push(taboolaParams);
  }

  _fireCommonTaboolaParams() {
    let taboolaParams = {
      mode: 'thumbnails-c',
      container:
        this.props.placement === 'article'
          ? 'taboola-below-article-thumbnails'
          : 'taboola-home-page',
      placement:
        this.props.placement === 'article'
          ? 'Below Article Thumbnails'
          : 'Home Page Thumbnails',
      target_type: 'mix'
    };
    _taboola.push(taboolaParams);

    taboolaParams = {};
    taboolaParams[this.props.placement] = 'auto';
    taboolaParams.url = this._buildCanonicalUrl();
    _taboola.push(taboolaParams);
  }
}

export default Taboola;
