import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react';
import { withSmartKnobs } from 'storybook-addon-smart-knobs';

import FrontPage from 'microzine-3.2/views/FrontPageViews/FrontPage';
import Article from 'microzine-3.2/models/Article';
import facebookArticles from './_facebookData';

let articles = facebookArticles.map(articleJSON => new Article(articleJSON));
//import { promos } from '../../partials/_promoTileData';

storiesOf('FrontPage', module)
  .addDecorator(withSmartKnobs)
  .addDecorator(withKnobs)
  .add('FrontPage', () => <FrontPage articles={articles} />, {
    notes: 'The Front Page Component appears on the Microzine entry page. '
  });
