import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
//import Utils from 'microzine-3.2/helpers/MicrozineUtils';
//import Page from 'microzine-3.2/api/Page';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  z-index: 1;
  font-size: 0;
  margin: 10px 10px 0 10px;
  cursor: pointer;
  text-align: center;
  transition: all 0.7s ease-out;
  img {
    box-sizing: border-box;
    position: relative;
    width: 100%;
  }
  iframe {
    box-sizing: border-box;
    height: 100%;
    position: absolute;
    width: 100%;
    left: 0;
  }
  &.expanded {
    cursor: initial;
    height: 100% !important;
  }
`;

const HeroVideoStandInStyle = styled.div`
  position: absolute;
  width: 100%;
  z-index: -1;
  height: 100%;
  span {
    display: block;
    width: 100%;
    height: 100%;
    background-size: cover, contain !important;
  }
`;

class HeroVideoStandIn extends Component {
  render(props) {
    return (
      <HeroVideoStandInStyle className="stand_in">
        <span
          style={
            props.image
              ? { background: 'url(' + props.image + ') 50% 50% no-repeat' }
              : {}
          }
        />
      </HeroVideoStandInStyle>
    );
  }
}

class ArticleVideo extends Component {
  componentWillMount() {
    this.containerDiv = '';
    let id = '';
    switch (this.props.source) {
      case 'videojs':
        id = this.props.id;
        this.containerDiv = (
          <div
            style={{ display: 'block', position: 'relative', width: '100%' }}
            id={'video__' + id}>
            <video
              id={'videojs__' + id}
              className="video-js"
              controls
              poster={this.props.image}
              style={{
                width: '100%',
                height: this.props.height + 'px',
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0
              }}>
              <source src={this.props.url} type={this.props.mimeType} />
            </video>
          </div>
        );
        break;
      case 'youtube':
        //from http://stackoverflow.com/questions/10591547/how-to-get-youtube-video-id-from-url
        id = this.props.url.match(
          /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
        )[1];
        this.containerDiv = <div id={'video::' + id} />;
        break;
      case 'brightcove':
        id = this.props.id;
        this.containerDiv = (
          <div
            style={{ display: 'block', position: 'relative', width: '100%' }}
            id={'video::' + id}>
            <div style={{ paddingTop: '60%' }}>
              <video
                id={'videojs::' + id}
                data-embed="default"
                class="video-js"
                controls
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0
                }}
              />
            </div>
          </div>
        );
        break;
    }
  }

  render(props) {
    //modest youtube branding: https://productforums.google.com/forum/#!topic/youtube/rhee7Z5Uf-A
    return (
      // hero class referenced in ArticlePageBlog
      <Wrapper
        className="hero"
        data-video-source={props.source}
        style={
          props.source !== 'videojs'
            ? { height: props.height }
            : { height: props.height, paddingBottom: 0 }
        }>
        {props.source !== 'videojs' ? (
          <HeroVideoStandIn image={props.image} />
        ) : (
          ''
        )}
        {this.containerDiv}
      </Wrapper>
    );
  }
}

export default ArticleVideo;
