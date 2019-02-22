import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import styled from 'styled-components';

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
const Wrapper = styled.div`
position: fixed;
transition: height .3s;
width: 100vw;
background - position: 50 %;
background - size: cover;
background - repeat: no - repeat;
height: 170px;
cursor: pointer;
-webkit - transform: translate3d(0px, 40px, 0px);
transform: translate3d(0px, 40px, 0px);
box - shadow: none;
`;

const HeroImage = () => (
  <StaticQuery
    query={graphql`
      query {
        placeholderImage: file(relativePath: { eq: "brand_header.jpg" }) {
          childImageSharp {
            fluid(maxWidth: 1500) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={data => <Wrapper><Img fluid={data.placeholderImage.childImageSharp.fluid} /></Wrapper>}
  />
)
export default HeroImage  
