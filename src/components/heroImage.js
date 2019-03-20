import React from "react";
import { StaticQuery, graphql } from "gatsby";
//import Img from "gatsby-image";
import styled from "styled-components";
import BackgroundImage from "gatsby-background-image";

/*
 * This component is built using `gatsby-image` to automatically serve optimized
 * images with lazy loading and reduced file sizes. The image is loaded using a
 * `StaticQuery`, which allows us to load the image from directly within this
 * component, rather than having to pass the image data down from pages.
 *
 * For more information, see the docs:
 * - `gatsby-image`: https://gatsby.app/gatsby-image
 * - `StaticQuery`: https://gatsby.app/staticquery
 */
// const Wrapper = styled.div`
//   position: fixed;
//   transition: height 0.3s;
//   left: 0;
//   width: 100vw;

//   background-position: 50 %;
//   background-size: cover;
//   background-repeat: no - repeat;
//   height: 170px;
//   cursor: pointer;
//   -webkit-transform: translate3d(0px, 40px, 0px);
//   transform: translate3d(0px, 40px, 0px);
//   box-shadow: none;
//   @media (min-width: 768px) {
//     height: 250px;
//   }
//   @media (min-width: 1440px) {
//     height: 320px;
//   }
// `;

// const HeroImage = () => (
//   <StaticQuery
//     query={graphql`
//       query {
//         placeholderImage: file(relativePath: { eq: "brand_header.jpg" }) {
//           childImageSharp {
//             fluid(maxWidth: 1500) {
//               ...GatsbyImageSharpFluid
//             }
//           }
//         }
//       }
//     `}
//     render={data => (
//       <Wrapper id="brand_header">
//         <Img fluid={data.placeholderImage.childImageSharp.fluid} />
//       </Wrapper>
//     )}
//   />
// );
// export default HeroImage;

const BackgroundSection = ({ className }) => (
  <StaticQuery
    query={graphql`
      query {
        desktop: file(relativePath: { eq: "brand_header.jpg" }) {
          childImageSharp {
            fluid(quality: 100, maxWidth: 4160) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    `}
    render={data => {
      // Set ImageData.
      const imageData = data.desktop.childImageSharp.fluid;
      console.log("className", className);
      return (
        <BackgroundImage
          Tag="section"
          className={className}
          classId="brand_header"
          fluid={imageData}
          backgroundColor={`#040e18`}
        >
          {/* <h1>Hello gatsby-background-image</h1> */}
        </BackgroundImage>
      );
    }}
  />
);

const HeroImage = styled(BackgroundSection)`
  position: fixed !important;
  transition: height 0.3s !important;
  left: 0;
  width: 100vw;

  background-position: 50%;
  background-size: cover;
  background-repeat: no-repeat;
  height: 170px;
  cursor: pointer;
  -webkit-transform: translate3d(0px, 40px, 0px);
  transform: translate3d(0px, 40px, 0px);
  box-shadow: none;
  @media (min-width: 768px) {
    height: 250px;
  }
  @media (min-width: 1440px) {
    height: 320px;
  }
`;

export default HeroImage;
