import React from "react";
import { Link } from "gatsby";
import Layout from "../components/layout";
import Properties from "microzine-3.2/helpers/MicrozineProperties";
import Scroller from "microzine-3.2/api/Scroller";
import Page from "microzine-3.2/api/Page";
import Utils from "microzine-3.2/helpers/MicrozineUtils";

// import Image from "../components/image"
import SEO from "../components/seo";

window.ArticleCollections = function() {};
Object.assign(window.ArticleCollections, {
  getCollections: function() {
    return [{ name: "blog", url: "fuels-petrol-2019/1blog.json", title: "" }];
  }
});
window.mzMetadata = {};
window.mzMetadata.brand_name = "FNP2019";
window.ZBI_MZCONFIG = {};
window.ZBI_MZCONFIG.brand_name = "FNP2019";
Properties.endCardPlacement = ["related", "promotion", "promobutton"];
const ZUMOBI = "//zumobi.com";
Properties.registeredUrls = {
  headerUrl: ZUMOBI,
  ctaUrl: ZUMOBI,
  ctaCardUrl: ZUMOBI,
  promoCardUrl: ZUMOBI
};

/**
 * Scroll handler
 *
 * Run brand header animation.
 * Displatch a user scrolled event..
 * @todo move hero parallax to FrontPage.jsx
 *
 * @param {number} scrollTop Amount scrolled.
 */
const handleScroll = ({ scrollTop }) => {
  if (scrollTop < Page.getHeroHeight()) {
    if (scrollTop > 40) {
      //MicrozineEvents.dispatchEvent("userscrolled");
    }
    Utils.set3dTransform(
      document.querySelector(".gatsby-background-image-brand_header"),
      0,
      40 + -scrollTop * 0.4,
      0
    );
  }
};

Scroller.addEventListener("mainPageScroll", handleScroll.bind(this));

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <h1>Fuel & Petrols</h1>
    <Link to="/articles/">Click here to see Articles</Link>
  </Layout>
);

export default IndexPage;
