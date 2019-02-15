import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'
import SiteMetadata from '../components/site-metadata'
import styled from 'styled-components';
import { fontWeights } from '../styles/designSystem';
const Wrapper = styled.div`
  position: relative;
  line-height: 20px;
  margin: 0 10px;

  strong {
    font-weight: ${fontWeights.semiBold};
  }
  img {
    height: auto;
    width: 100%;
    padding: 0;
    border-radius: 5px;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.5);
  }
  p {
    margin: 0 0 10px 0;
  }
  iframe {
    width: 100%;
    margin: 20px 0;
  }
`;


export default ({ pageContext: { article } }) => {
  function createMarkup() {
    return { __html: article.article_content }
  }
  // console.log('article', article);
  const baseURL = 'https://cdn-prototype.microsites.partnersite.mobi';
  return (
    <Layout>
      <SiteMetadata pathname={`articles/${article.article_clean_title}`} />
      <Link to="/articles">Back to all Articles</Link>
      <Link to={`/`}>
        <p>Home</p>
      </Link>
      <Wrapper style={{ margin: '4rem auto' }}>
        <h1>{article.article_title}</h1>
        <img alt={article.article_title} src={`${baseURL}${article.article_image_url}`} />
        <p>By {article.article_author}</p>
        <div dangerouslySetInnerHTML={createMarkup()} />
      </Wrapper>
    </Layout>
  )
}
