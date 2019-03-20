import React, { Component } from "react"; //eslint-disable-line no-unused-vars
import Properties from "microzine-3.2/helpers/MicrozineProperties";
import styled from "styled-components";

const NoImage = styled.div`
  padding-top: 35px;
  background-color: #f2f2f2;
  padding: 0;
`;

const Wrapper = styled.div`
  position: relative;
  z-index: 1;
  font-size: 0;
  margin: 10px 10px 0 10px;
  cursor: pointer;
  text-align: center;
  transition: all 0.7s ease-out;
  img {
    box-sizing: border-box;
    position: relative;
    width: 100%;
  }
  iframe {
    box-sizing: border-box;
    height: 100%;
    position: absolute;
    width: 100%;
    left: 0;
  }
  &.expanded {
    cursor: initial;
    height: 100% !important;
  }
`;

/**
 * Article image used on article detail pages.
 */
class ArticleImage extends Component {
  /**
   * Constructor
   * @param {Object} props compnent properties
   */
  constructor(props) {
    //let i = 'http://staging.microsites.partnersite.mobi/zumobi/3-1/external_assets/1d830664798468f1171995b390eba4b1e2ba772b_medium.jpg';
    super(props);
    this.onImageError = this.onImageError.bind(this);
    this.state = {
      style: this.props.style,
      image: props.image,
      heroImageStyle: {}
    };
  }

  /**
   * On image error modify the style of the image holder and replace image src with error svg
   *
   */
  onImageError() {
    let errorStyle = {
      backgroundColor: "#b4b4b4",
      paddingTop: "56.25%",
      height: 0,
      marginBottom: 10
    };
    this.setState({
      style: errorStyle,
      heroImageStyle: {
        left: "50%",
        position: "absolute",
        top: "50%",
        width: "auto",
        transform: "translate(-50%,-50%)"
      },
      image: `${Properties.assetPath}/broken.svg`
    });

    // let parent know there is an error so they could adjust some stuff that we can't get to from here.
    if (this.props.onArticleImageError) {
      this.props.onArticleImageError();
    }
  }

  /**
   * Lifecycle method.
   *
   * @returns {Component} - Article Image
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      style: nextProps.style
    });
  }

  render() {
    let image = "";

    if (this.state.image && this.state.image !== "") {
      image = (
        <img
          src={this.state.image}
          style={this.state.heroImageStyle}
          onError={this.onImageError}
          onClick={this.props.handleImageExpand}
        />
      );
    } else {
      return <NoImage />;
    }
    return (
      // hero class referenced in ArticlePageBlog
      <Wrapper className={"hero"} style={this.state.style}>
        {image}
      </Wrapper>
    );
  }
}

export default ArticleImage;
