import React from "react";
import Layout from "../components/layout";
import SiteMetadata from "../components/site-metadata";
import HeroImage from "../components/heroImage";
import FrontPage from "microzine-3.2/views/FrontPageViews/FrontPage";
import Article from "microzine-3.2/models/Article";
import EndMsg from "microzine-3.2/views/partials/EndMsg";
import Footer from "microzine-3.2/views/partials/Footer";
import ScrollIndicator from "microzine-3.2/views/ScrollIndicator";
import CallToAction from "microzine-3.2/views/partials/buttons/CtaButton";
import MicrozineEvents from "microzine-3.2/helpers/MicrozineEvents";
import Properties from "microzine-3.2/helpers/MicrozineProperties";
import ShareModule from "microzine-3.2/views/ShareModule";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  background-color: #e5e5e5;
  top: 210px;
  overflow: inherit;
  z-index: 2;
  width: 100%;
  @media (min-width: 768px) {
    top: 290px;
  }
`;

export default ({ pageContext: { allArticles } }) => {
  MicrozineEvents.dispatchEvent("microzineready");
  var articles = allArticles.map(a => new Article(a));
  Properties.articles = articles;
  const foo = "foo";
  return (
    <Layout>
      <SiteMetadata pathname={`articles`} />
      <HeroImage />

      <Wrapper>
        <CallToAction />
        <FrontPage articles={articles} />
        <EndMsg />
        <Footer />
        <ScrollIndicator />
        <ShareModule />
      </Wrapper>
    </Layout>
  );
};
