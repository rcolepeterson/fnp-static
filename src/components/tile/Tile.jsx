import React, { Component } from "react"; //eslint-disable-line no-unused-vars
import TileImage from "./TileImage";
import TileTitle from "./TileTitle";
import { Link } from "gatsby";
import TileChannelBar from "./TileChannelBar";
import styled from "styled-components";
import { getDateFormatted } from "../../utils";
import PropTypes from "prop-types";
const getFormatedDate = (article, format) => {
  return getDateFormatted(article.article_published_at, format);
};

export const Wrapper = styled.div`
  padding: 10px;
  margin: 2px 0px;
  position: relative;
  display: block;
  background-color: #ffffff;
  overflow: hidden;
  cursor: pointer;
  opacity: 1;
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
  }

  getScaledHeight() {
    let dims = this.props.article.article_image_details.medium.dimensions.match(
      /(\d+)x(\d+)/
    );
    let dimsW = parseInt(dims[1]);
    let dimsH = parseInt(dims[2]);
    let clientW = 1024;
    if (typeof document !== `undefined`) {
      clientW = Math.min(document.body.clientWidth, 1024);
    }
    // 21 = 20px for padding and 1px for border.
    let clientWidth = clientW / 2 - 21;
    let aspectRatio = dimsW / dimsH;
    let heightT = clientWidth / aspectRatio;
    if (this.scaledHeight === 0) {
      return heightT;
    }
    return this.scaledHeight;
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
        ref={node => (this.node = node)}
        id={this.props.id}
        className={`${this.state.loaded && "isVisible"}`}
        data-article_digest={this.props.article.article_digest}
      >
        <Link to={`/articles/${this.props.article.article_clean_title}`}>
          {this.props.article.article_image_url && (
            <TileImage imageURL={this.props.article.article_image_url} />
          )}

          <TileTitle article={this.props.article} />
          <TileChannelBar
            article={this.props.article}
            bottomInfo={getFormatedDate(this.props.article, "MMMM Do")}
          />
        </Link>
      </Wrapper>
    );
  }
}

Tile.propTypes = {
  article: PropTypes.object.isRequired
};

export default Tile;
