import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import Tile from 'microzine-3.2/views/partials/tile/Tile';
import PromoTile from 'microzine-3.2/views/partials/tile/PromoTile';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: inline-block;
  width: 100%;
  vertical-align: top;
  &:not(:only-child) {
    width: calc(100% / 2);
    max-width: 511px;
    &:first-child {
      a {
        margin: 2px 1px 2px 0px;
      }
    }
    &:last-child {
      a {
        margin: 2px 0px 2px 1px;
      }
    }
  }
`;

/**
 * Renders one column of the main page
 *
 * @version 1.0
 */
class FrontPageColumn extends Component {
  render({ articles, columnWidth, heroHeight = null, col }, state) {
    let tileViews = articles.map((a, row) => {
      if (a.source === 'product' || a.source === 'promo') {
        return (
          <PromoTile
            id={`t_${col}_${row}`}
            article={a}
            colWidth={columnWidth}
            heroHeight={heroHeight}
          />
        );
      } else {
        return (
          <Tile
            id={`t_${col}_${row}`}
            article={a}
            colWidth={columnWidth}
            heroHeight={heroHeight}
          />
        );
      }
    });

    return <Wrapper>{tileViews}</Wrapper>;
  }
}

export default FrontPageColumn;
