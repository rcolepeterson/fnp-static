import React, { Component } from "react"; //eslint-disable-line no-unused-vars
import TileImage from "microzine-3.2/views/partials/tile/TileImage";
import TileTitle from "microzine-3.2/views/partials/tile/TileTitle";
import TileChannelBar from "microzine-3.2/views/partials/tile/TileChannelBar";
import Scroller from "microzine-3.2/api/Scroller";
import { Link } from "gatsby";

import styled from "styled-components";
import PropTypes from "prop-types";
const baseURL = "http://prototype.microsites.partnersite.mobi";

export const Wrapper = styled(Link)`
  padding: 10px;
  margin: 2px 0px;
  position: relative;
  display: block;
  background-color: #ffffff;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.8s;
  color: inherit;
  text-decoration: none;

  &.isVisible {
    opacity: 1;
  }
`;

/**
 * Microzine front-page Tile component
 */
class Tile extends Component {
  /**
   * Creates a new Tile instance
   */
  constructor(props) {
    super(props);
    this.state = {
      imageURL: "",
      gifURL: "",
      vidURL: "",
      loaded: false,
      imgStyle: ""
    };
    this.scaledHeight = 0;
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll() {
    this.shouldLoad();
  }
  // @todo cpeterson - had to switch to window on scroll. VS using the static Scroller on scroll event.
  componentDidMount() {
    this.shouldLoad();
    window.addEventListener("scroll", this.handleScroll);
  }

  getScaledHeight() {
    let dims = this.props.article.article_image_details.medium.dimensions.match(
      /(\d+)x(\d+)/
    );
    let dimsW = parseInt(dims[1]);
    let dimsH = parseInt(dims[2]);
    let clientW = Math.min(document.body.clientWidth, 1024);
    // 21 = 20px for padding and 1px for border.
    let clientWidth = clientW / 2 - 21;
    let aspectRatio = dimsW / dimsH;
    let heightT = clientWidth / aspectRatio;
    
    if (this.scaledHeight === 0) {
      return heightT;
    }
    return this.scaledHeight;
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  componentDidUpdate() {
    if (typeof window === "undefined" || this.state.loaded) {
      return;
    }
    this.shouldLoad();
  }

  shouldLoad() {
    if (!this.node) {
      console.log('ooops');
      return;
    }
    

    let rect = this.node.getBoundingClientRect();
    let clientHeight =
      window.innerHeight || document.documentElement.clientHeight;
    let buffer = 140;
    if (
      !this.state.loaded &&
      rect.top >= -buffer &&
      rect.bottom <= clientHeight + 600
    ) {
      window.removeEventListener("mainPagescrollscrollScroll", this.handleScroll);
      this.node.classList.add("isVisible");
      this.setState({
        imageURL: baseURL + this.props.article.articleImage.url,
        loaded: true
      });
    }
  }

  /**
   * Renders the Tile instance
   *
   * @param {Object} props  - Properties set for this Tile
   * @param {Object} state  - Current state of this Tile
   * @returns {Component}   - Tile component
   */
  render() {
    return (
      <Wrapper
        to={`/articles/${this.props.article.article_clean_title}`}
        ref={node => (this.node = node)}
        id={this.props.id}
        className={`${this.state.loaded && "isVisible"}`}
      >
        {this.props.article.hasTileImage && (
          <TileImage
            imageURL={this.state.imageURL}
            imageHeight={this.getScaledHeight()}
          />
        )}
        <TileTitle article={this.props.article} />
        <TileChannelBar
          article={this.props.article}
          bottomInfo={this.props.article.getFormatedDate("MMMM Do")}
        />
      </Wrapper>
    );
  }
}

Tile.propTypes = {
  article: PropTypes.object.isRequired
};

export default Tile;
