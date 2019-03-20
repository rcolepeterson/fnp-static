import React from 'react';
import { storiesOf } from '@storybook/react';
import { withSmartKnobs } from 'storybook-addon-smart-knobs';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react';
import { withNotes } from '@storybook/addon-notes';
import { articles } from '../tile/_tileData';
import { relatedArticlesData, picture } from './_articlesData';

import RelatedArticle from './RelatedArticleViews/RelatedArticle';
import RelatedArticlesContainer from './RelatedArticleViews/RelatedArticlesContainer';
import ArticleTitle from 'microzine-3.2/views/partials/article/ArticleTitle';
import InfoPanel from 'microzine-3.2/views/partials/article/InfoPanel';
import Article from 'microzine-3.2/models/Article';
import MainContent from 'microzine-3.2/views/partials/article/MainContent';
const testarticles = articles.map(articleJSON => new Article(articleJSON));
console.log('testarticles',testarticles[0].content)

storiesOf('Article modules', module)
  .addDecorator(withSmartKnobs)
  .addDecorator(withKnobs)
  .add('RelatedArticle', () => (
    <RelatedArticle
      thumbnail={picture}
      title="hello! This is a fake title to test with."
      url="https://www.zumobi.com/"
      external={false}
      isSingle={false}
    />
  ))
  .add('RelatedArticlesContainer 2 articles', () => (
    <RelatedArticlesContainer relatedArticles={relatedArticlesData} />
  ))
  .add(
    'RelatedArticlesContainer 1 article',
    withNotes(
      'This is an example of Related Articles Module that only has 1 article.'
    )(() => (
      <RelatedArticlesContainer
        relatedArticles={relatedArticlesData.filter((item, i) => i === 0)}
      />
    ))
  )
  .add('ArticleTitle', () => {
    return (
      <ArticleTitle
        source={testarticles[0].source}
        title={testarticles[0].articleTitle}
        collectionIcon={testarticles[0].icon}
        icon={testarticles[0].profileImage}
      />
    );
  })
  /**** Cannot get main content to work because of the mark up component we are using. */
  // .add('MainContent', () => {
  //   return <MainContent content={testarticles[0].content} />;
  // })
  .add('InfoPanel', () => {
    return <InfoPanel leftInfo={testarticles[0].rightInfo} rightInfo={''} />;
  });
