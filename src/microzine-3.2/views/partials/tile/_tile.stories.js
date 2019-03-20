import React from 'react';
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';

import Tile from './Tile';
import TileTitle from 'microzine-3.2/views/partials/tile/TileTitle';
import TileChannelBar from 'microzine-3.2/views/partials/tile/TileChannelBar';
import PromoTile from './PromoTile';
import { articles } from './_tileData';
import { promos } from './_promoTileData';

window.ArticleCollections = function() {};
Object.assign(window.ArticleCollections, {
  getCollections: function() {
    return [
      {
        button: 'sign up',
        type: 'promo'
      }
    ];
  }
});

storiesOf('Tiles', module)
  .add(
    'Tile',
    withNotes(
      'This isn\'t updatable with knobs because it seems it clones the object or expects JSON only and we have a "Article" object that has functions attached to it.'
    )(() => <Tile article={articles[0]} />)
  )
  .add('TileTitle', () => <TileTitle article={articles[0]} />)
  .add('TileChannelBar', () => (
    <TileChannelBar
      article={articles[0]}
      bottomInfo={articles[0].getFormatedDate('MMMM Do')}
    />
  ))
  .add('Promo Tile', () => <PromoTile article={promos[0]} />);
