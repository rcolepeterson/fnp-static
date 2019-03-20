import React, { Component } from "react"; //eslint-disable-line no-unused-vars
import Page from "microzine-3.2/api/Page";
import ArticleImage from "microzine-3.2/views/partials/article/ArticleImage";
import Utils from "microzine-3.2/helpers/MicrozineUtils";
import Properties from "microzine-3.2/helpers/MicrozineProperties";
import InfoPanel from "microzine-3.2/views/partials/article/InfoPanel";
import Footer from "microzine-3.2/views/partials/Footer";
import MainContent from "microzine-3.2/views/partials/article/MainContent";
import ArticleTitle from "microzine-3.2/views/partials/article/ArticleTitle";
import ArticleExpandButton from "microzine-3.2/views/partials/article/ArticleExpandButton";
import Promotion from "microzine-3.2/views/partials/article/Promotion";
import PromoButtonCard from "microzine-3.2/views/partials/buttons/PromoButton";
import Video from "microzine-3.2/api/Video";
import RelatedArticlesContainer from "microzine-3.2/views/partials/article/RelatedArticleViews/RelatedArticlesContainer";
//import ShoppableList from 'microzine-3.2/views/partials/article/ShoppableViews/ShoppableList';
import Scroller from "microzine-3.2/api/Scroller";
import styled from "styled-components";
import { fonts, colors } from "microzine-3.2/styles/designSystem";
const baseURL = "http://prototype.microsites.partnersite.mobi";

class ArticlePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.extraClass = "";
    this.endCards = Array.from(
      Array(Properties.endCardPlacement.length),
      () => ""
    );
    this.resizeRef = Page.addEventListener(
      "resize",
      this.handleResize.bind(this)
    );
    this.videoRef = Video.addEventListener(
      "videostarted",
      this.videoStarted.bind(this)
    );
    console.log("Page.width", Page.width);
    console.log("Page.dimensions", this.props.article.articleImage.dimensions);
    //-20 for the 10px padding on each side of the image
    this.setState({
      scaledHeight: Utils.getDimensions(
        this.props.article.articleImage.dimensions,
        Math.min(Page.width - 20, 700 - 20)
      ).scaledHeight,
      maxHeight: Page.height * 0.65,
      userExpanded: false
    });
    console.log(
      Utils.getDimensions(
        this.props.article.articleImage.dimensions,
        Math.min(Page.width - 20, 700 - 20)
      ).scaledHeight
    );
    this.state.maxHeight = Page.height * 0.65;
    this.contentWrapper = "";
    this.articleImage = "";

    this.doStuff();
  }

  handleResize() {
    //-20 for the 10px padding on each side of the image
    let dims = Utils.getDimensions(
      this.props.article.articleImage.dimensions,
      Math.min(Page.width - 20, 700 - 20)
    );
    let maxHeight = Page.height * 0.65;
    let expanded = "";
    //if you are not expanded, conditionally show the article expand button
    if (
      this.state.scaledHeight > this.state.maxHeight &&
      !this.state.userExpanded
    ) {
      this.expandButton = <ArticleExpandButton text="View Full Image" />;
      expanded = "";
    } else {
      this.expandButton = "";
      expanded = "expanded";
    }
    this.setState({
      scaledHeight: dims.scaledHeight,
      maxHeight: maxHeight,
      expanded: expanded
    });
  }

  componentWillUnmount() {
    Page.removeEventListener("resize", this.resizeRef);
    Video.removeEventListener("videostarted", this.videoRef);
    if (this.hero) {
      this.hero.style.display = "block";
    }
  }

  handleImageExpand() {
    this.setState({ expanded: "expanded", userExpanded: true });
  }

  /**
   * On Article Image load error.
   * Make sure we do not display the expanded image deal.
   *
   */
  onImageError() {
    this.handleImageExpand();
  }

  videoStarted(e) {
    if (this.props.article.id && e.videoID === this.props.article.id) {
      Scroller.smoothScrollTo(0, 300);
      this.setState({ expanded: "expanded" });
    }
  }

  doStuff() {
    let promotion = "",
      promobutton = "",
      related = "";
    let relatedPos = Properties.endCardPlacement.findIndex(card => {
      return card === "related";
    });
    if (
      relatedPos !== -1 &&
      this.props.article.article_related_articles.length > 0
    ) {
      related = (
        <RelatedArticlesContainer
          key={"1"}
          relatedArticles={this.props.article.article_related_articles}
        />
      );
      this.endCards.splice(relatedPos, 1, related);
    }

    let promotionPos = Properties.endCardPlacement.findIndex(card => {
      return card === "promotion";
    });
    if (promotionPos !== -1) {
      promotion = <Promotion key={"2"} />;
      this.endCards.splice(promotionPos, 1, promotion);
    }
    let promobuttonPos = Properties.endCardPlacement.findIndex(card => {
      return card === "promobutton";
    });
    if (promobuttonPos !== -1) {
      promobutton = (
        <PromoWrapper key={"3"}>
          <PromoButtonCard
            icon="arrow"
            href={Properties.registeredUrls.ctaCardUrl}
          >
            Promotion
          </PromoButtonCard>
        </PromoWrapper>
      );
      this.endCards.splice(promobuttonPos, 1, promobutton);
    }
    // hack. if we are NOT in a iframe add this class.
    if (!Properties.isFriendlyIframe) {
      this.contentWrapperFlex = "content_wrapper_flex";
    }
  }

  render() {
    let articleImage = baseURL + this.props.article.articleImage.url;

    return (
      <Wrapper className={"article card"}>
        <ArticleImage
          onArticleImageError={this.onImageError.bind(this)}
          image={articleImage}
          handleImageExpand={this.handleImageExpand.bind(this)}
          // style={
          //   this.state.expanded
          //     ? {}
          //     : { height: this.state.maxHeight, overflow: "hidden" }
          // }
        />
        <div className={`content_wrapper ${this.contentWrapperFlex}`}>
          {!this.state.expanded ? this.expandButton : ""}
          <div className={"content_container card"}>
            <ArticleTitle
              source={this.props.article.source}
              title={this.props.article.articleTitle}
              collectionIcon={this.props.article.icon}
              icon={this.props.article.profileImage}
            />
            <InfoPanel leftInfo={this.props.article.rightInfo} rightInfo={""} />
            <MainContent content={this.props.article.content} />
          </div>
          {this.endCards}
        </div>
        <Footer data={this.props.data} />
      </Wrapper>
    );
  }
}

export const Wrapper = styled.div`
  ${fonts.Body} overflow: hidden;
  display: flex;
  min-height: calc(100% - 40px);
  -ms-flex-direction: column;
  flex-direction: column;
  word-wrap: break-word;
  overflow-wrap: break-word;
  -webkit-text-size-adjust: 100%;
  position: relative;
  z-index: 2;
  margin-bottom: 40px;
  background-color: #fff;
  padding-top: 20px;
  a {
    color: #4a4a4a;
    &.hash_tag,
    &.mention,
    &.link {
      color: ${colors.brand};
    }
  }
  .content_wrapper {
    background-color: #fff;
    position: relative;
    z-index: 2;
    display: block;
    border-bottom: 2px solid ${colors.background};
  }
  .content_wrapper_flex {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .content_container {
    position: relative;
    width: 100%;
    z-index: 2;
    flex-grow: 2;
    div:last-child {
      margin-bottom: 20px;
    }
  }
`;

const PromoWrapper = styled.div`
  border-top: 2px solid #e5e5e5;
  padding: 10px;
`;

export default ArticlePage;
