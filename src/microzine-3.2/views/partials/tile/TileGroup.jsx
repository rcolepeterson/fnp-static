import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import FrontPageColumn from 'microzine-3.2/views/partials/FrontPageColumn';
import styled from 'styled-components';

const Wrapper = styled.div`
  &:not(:first-child) {
    margin-top: -2px;
  }
`;

class TileGroup extends Component {
  constructor(props) {
    super(props);
    this.rendered = false;
    // Scroller.addEventListener('mainPageScroll', this.handleScroll.bind(this));
    this.tileRefs = [];
    this.tiles = [];
    this.state = {
      isVisible: false,
      colWidth: (1 / this.props.columnsPerRow) * 100
    };
  }

  // ALL THIS GETS HANDLED PER TILE so we probs dont need to do it here.
  //
  // handleScroll () {
  //   this.show();
  // }
  // show () {
  //   if (!this.rendered) { return ; }

  //   let height = Page.height,
  //       bottom = (Scroller.scrollTop + height);

  //   if (!this.state.isVisible && document.getElementById(this.props.id).offsetTop + 200 < bottom + Page.height * 0.1) {
  //     this.setState({ isVisible: true });
  //   }
  // }

  componentWillMount() {
    this.balanceColumns(this.props.columnsPerRow);
  }

  balanceColumns(columnsPerRow) {
    let items = [].concat(this.props.data),
      columnsArticles = [];

    this.tileColumns = [];

    let tiles = items.map(item => {
      let height = item.tileImage.dimensions.split('x')[1];
      if (height === '0') {
        height = 90;
      } // HARDCODED: if image height is 0 the tile will still have a minimum height of about 90 (text and stuff)
      return [item, parseInt(height)];
    });

    // tiles.sort((a, b)=>{ return b[1] - a[1]; }); // sort articles from tallest to shortest based on their image height

    // create arrays that will become columns
    while (columnsArticles.length < columnsPerRow) {
      columnsArticles.push([]);
    }

    tiles.forEach((tile, i) => {
      // fill first row
      if (i < columnsPerRow) {
        // columnNumber, current columnheight, Article
        columnsArticles[i].push(i, tile[1], tile[0]);
        return;
      }
      // check for shortest
      let shortestCol = [].concat(columnsArticles).sort((a, b) => {
        return a[1] - b[1];
      })[0][0];

      // push the next article to the shortest and add the height to the shortest
      columnsArticles[shortestCol].push(tile[0]);
      columnsArticles[shortestCol][1] += tile[1];
    });

    // remove heights and column numbers from sub-arrays
    columnsArticles.forEach(col => {
      col.splice(0, 2);
    });

    this.tileColumns = columnsArticles.map((c, i) => (
      <FrontPageColumn articles={c} col={i} />
    ));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.columnsPerRow !== this.props.columnsPerRow) {
      this.balanceColumns(nextProps.columnsPerRow);
    }
  }

  render() {
    return (
      <Wrapper
        className={`${this.state.isVisible ? ' show' : ''}`}
        id={this.props.id}>
        <div id={`tiles_${this.props.id}`}>{this.tileColumns}</div>
        {this.props.children}
      </Wrapper>
    );
  }
}

export default TileGroup;
