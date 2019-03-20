import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import Properties from 'microzine-3.2/helpers/MicrozineProperties';
import PromoButton from 'microzine-3.2/views/partials/buttons/PromoButton';
import styled from 'styled-components';
import { fonts, typeSizes, colors } from 'microzine-3.2/styles/designSystem';

const Wrapper = styled.div`
  border-top: 2px solid ${colors.background};
  padding: 10px;
  > a {
    text-decoration: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
`;

const Image = styled.div`
  min-height: 200px;
  position: relative;
`;

const CardTitle = styled.div`
  ${fonts.Title};
  font-size: ${typeSizes[1]};
  margin: 5px 0 15px;
  display: block;
  text-transform: uppercase;
`;

const PromoContent = styled.div`
  span {
    ${fonts.Body};
    display: block;
    padding: 14px 0;
    &:first-child {
      padding: 14px 0 0;
      ${fonts.Title};
    }
  }
`;

class Promotion extends Component {
  render() {
    let promotionBg = {
      backgroundImage: `url(${Properties.assetPath}/promo.jpg)`,
      backgroundPosition: 'center',
      backgroundSize: 'cover'
    };
    return (
      <Wrapper>
        <CardTitle>Promotion</CardTitle>
        <a target="_blank" href={Properties.registeredUrls.promoCardUrl}>
          <Image className="promotion_image" style={promotionBg} />
          <PromoContent>
            <span>
              Long Title That Shouldn’t Wrap But Can If Absolutely Necessary
            </span>
            <span>
              I have hinted that I would often jerk poor Queequeg from between
              the whale and the ship—where he would occasionally fall, from the
              incessant rolling and swaying of both. But this was not the only
              jamming jeopardy
            </span>
          </PromoContent>
          <PromoButton icon="arrow" className="button">
            <span>Learn More</span>
          </PromoButton>
        </a>
      </Wrapper>
    );
  }
}

export default Promotion;
