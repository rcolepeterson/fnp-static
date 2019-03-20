import React from 'react'; //eslint-disable-line no-unused-vars
import Tile, { Wrapper } from 'microzine-3.2/views/partials/tile/Tile';
import TileImage from 'microzine-3.2/views/partials/tile/TileImage';
import TileTitle from 'microzine-3.2/views/partials/tile/TileTitle';
import Button from 'microzine-3.2/views/partials/buttons/Button';
import styled from 'styled-components';
import { typeSizes, fonts } from 'microzine-3.2/styles/designSystem';

const StaticWrapper = styled(Wrapper)`
  padding: 10px;
  &.productPurchase {
    .product_price {
      ${fonts.Info};
      font-size: ${typeSizes[1]};
      text-align: left;
      display: block;
      padding-bottom: 15px;
      line-height: $social_info_size;
    }
  }
`;

class PromoTile extends Tile {
  componentWillMount() {
    let staticCollections = window.StaticCollections.getStaticCollections();
    if (staticCollections) {
      this.staticCollection = staticCollections.find(collection => {
        return collection.type === this.props.article.source;
      });
    } else {
      this.staticCollection = {};
    }
  }

  render() {
    return (
      <div ref={node => (this.node = node)}>
        <StaticWrapper
          id={this.props.id}
          target="_blank"
          href={this.props.article.article_extras.url}
          className={`
          ${this.props.article.article_extras.price && 'productPurchase'} 
          ${this.state.loaded && 'isVisible'}
          `}>
          {this.props.article.hasTileImage && (
            <TileImage
              imageURL={this.state.imageURL}
              imageHeight={this.getScaledHeight()}
            />
          )}
          <TileTitle isStatic article={this.props.article} />
          {this.props.article.article_extras.price && (
            <span className="product_price">
              {this.props.article.article_extras.price}
            </span>
          )}
          {this.staticCollection &&
            this.staticCollection.button && (
              <Button>{this.staticCollection.button}</Button>
            )}
        </StaticWrapper>
      </div>
    );
  }
}

export default PromoTile;
