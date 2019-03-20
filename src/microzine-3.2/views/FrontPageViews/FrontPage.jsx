import React, { Component } from "react"; //eslint-disable-line no-unused-vars
import Tile from "microzine-3.2/views/partials/tile/Tile";
import PromoTile from "microzine-3.2/views/partials/tile/PromoTile";
import styled from "styled-components";
import PropTypes from "prop-types";

export const Wrapper = styled.div`
  text-align: center;
  font-size: 14px;
  position: relative;
  display: flex;
  justify-content: space-between;
`;

const ColumnStyles = styled.div`
  box-sizing: border-box;
  flex: 1;
  margin-right: 2px;
  &:last-child {
    margin-right: 0;
  }
`;

class FrontPage extends Component {
  constructor(props) {
    super(props);
    this.articles = this.props.articles;
    // holds VNodes
    this.mappedTiles = null;
    // holds DOM elements used for measuring.
    this.DOMTiles = null;
    this.state = {
      rendered: false
    };
    this.uniqueId = Math.floor(1000 + Math.random() * 9000);
  }

  /**
   * Returns tile or promo tile based on article.article_extras.source
   * This value is defined in the mapping file.
   *
   * @param {*} article
   * @returns {React Element} Tile or Prmo component.
   */
  getTileType(article, key) {
    if (!article) {
      return null;
    } else if (
      article &&
      article.article_extras &&
      (article.article_extras.source === "promo" ||
        article.article_extras.source === "product")
    ) {
      return <PromoTile article={article} />;
    }
    return <Tile key={key} article={article} />;
  }
  /**
   * Loops thru the articles and returns a mapped element for the render method.
   * @returns {Array} Array of VNodes. Tile || PromoTile
   */
  getVNodeTiles() {
    if (this.mappedTiles) {
      return this.mappedTiles;
    }
    let mappedTiles = this.articles.map((article, i) => {
      return (
        <div
          id={`column-tile-holder${i}-${this.uniqueId}`}
          key={i}
          className={"column-tile"}
        >
          {this.getTileType(article, i)}
        </div>
      );
    });
    this.mappedTiles = mappedTiles;
    return mappedTiles;
  }
  /**
   * Loops thru articles and, for each article, stores a DOM reference in an array.
   * We will use these array items when measuring.
   * @returns {Array} Array of DOM elements.
   */
  getDOMTiles() {
    if (this.DOMTiles) {
      return this.DOMTiles;
    }
    let dimensions = [];
    this.articles.forEach((article, i) =>
      dimensions.push(
        document.querySelector(`#column-tile-holder${i}-${this.uniqueId}`)
      )
    );
    this.DOMTiles = dimensions;
    return dimensions;
  }
  // 1st time thru add elements to the DOM.
  // 2nd time thru measure elements and put tiles in correct collums based on height.
  renderItems() {
    console.log("renderItems", this.state.rendered);
    if (this.state.rendered) {
      //return items for realz.
      let vnodeTiles = this.getVNodeTiles();
      let domTiles = this.getDOMTiles();
      let cols = this.mapNodesToColumns(vnodeTiles, domTiles);
      // @tricky. on render we are going to fire this method if it exists.
      // the callee (Microzine.jsx) will then check for failed collections (due to timeout) and try
      // and load them a 2nd time and 3rd time.
      if (this.props.onRenderedHandler) {
        this.props.onRenderedHandler();
      }
      return this.createColumns(cols);
    } else {
      //return items for measuring.
      return this.createColumns([this.getVNodeTiles()]);
    }
  }

  createColumns(columnsContainers) {
    let renderedColumns = columnsContainers.map((column, i) => {
      return <ColumnStyles key={i}>{column}</ColumnStyles>;
    });
    return renderedColumns;
  }

  mapNodesToColumns(vnodes = [], elements = []) {
    let nodes = [];
    let heights = [];
    // use dimensions to calculate the best column for each child
    if (elements.length && elements.length === vnodes.length) {
      for (let i = 0; i < 2; i++) {
        nodes[i] = [];
        heights[i] = 0;
      }
      vnodes.forEach((child, i) => {
        let { width, height } = elements[i];
        height = elements[i].getBoundingClientRect().height;
        width = elements[i].getBoundingClientRect().width;
        let index = heights.indexOf(Math.min(...heights));
        nodes[index].push(child);
        heights[index] += height / width;
      });
    }
    return nodes;
  }
  componentDidMount() {
    setTimeout(() => {
      this.getDOMTiles();
      this.setState({ rendered: true });
    }, 1000);
  }

  componentWillReceiveProps(nextprops) {
    this.mappedTiles = [];
    this.DOMTiles = [];
    this.mappedTiles = null;
    this.DOMTiles = null;
    this.articles = nextprops.articles;
    this.setState({ rendered: false });

    setTimeout(() => {
      this.getDOMTiles();
      this.setState({ rendered: true });
    }, 1000);
  }

  render() {
    return (
      <Wrapper
        style={{
          visibility: this.state.rendered ? "visible" : "hidden",
          maxWidth: 1024,
          marginTop: 0,
          marginBottom: 0,
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
        {this.renderItems()}
      </Wrapper>
    );
  }
}

FrontPage.propTypes = {
  articles: PropTypes.array.isRequired
};

export default FrontPage;
