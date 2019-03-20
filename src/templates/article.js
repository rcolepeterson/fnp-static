import React from "react";
//import { Link } from "gatsby";
import Layout from "../components/layout";
//import SiteMetadata from "../components/site-metadata";
//import styled from "styled-components";
//import { fontWeights } from "../styles/designSystem";
import Scroller from "microzine-3.2/api/Scroller";
import ArticlePageBlog from "microzine-3.2/views/partials/article/ArticlePageBlog";
import ArticleClose from "microzine-3.2/views/partials/article/ArticleClose";
import Article from "microzine-3.2/models/Article";
export default ({ pageContext: { article } }) => {
  var a = new Article(article);
  Scroller.articleVisibility = true;
  return (
    <Layout>
      <ArticleClose source={article.article_extras.source} />,
      <ArticlePageBlog article={a} />
    </Layout>
  );
};
