import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import styled from 'styled-components';
import { fonts } from 'microzine-3.2/styles/designSystem';
import Properties from 'microzine-3.2/helpers/MicrozineProperties';

const Wrapper = styled.div`
  background-color: #ffffff;
  color: #7f7f7f;
  overflow: auto;
  margin: 0 auto;
  text-align: center;
  box-shadow: none;
  max-width: 1022px;
  padding: 15px;
  margin-bottom: 2px;
  p {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    padding: 15px 0px;
  }
  p:first-child {
    ${fonts.Title};
    margin-top: 30px;
  }
  p:nth-child(2) {
    padding-top: 0px;
  }
  a {
    color: $brand_color;
  }
  span {
    display: block;
    margin-left: auto;
    margin-right: auto;
    background-size: cover;
    width: 52px;
    height: 71px;
    background-image: url('${Properties.assetPath}/microzine-logo-grey.svg');
    margin-bottom: 30px;
  }
`;

class EndMsg extends Component {
  // handleAddToHomeScreen () {
  //   Router.setRoute(`${Utils.brand}/${Utils.entryPage}/sth`);
  // }
  render() {
    let saveToHomeText = '';
    // if(Modal.isATHSupported()){
    //   saveToHomeText = <p>For quick access to all the latest updates and stories simply tap this link and <a onClick={this.handleAddToHomeScreen}><b>SAVE THIS MICROZINE</b></a> to your home screen.</p>;
    // }
    return (
      <Wrapper>
        <p>Welcome, You Made It to the End</p>

        <p>
          You have reached the end of our stories. Please check back often as we
          are always adding new content for you to enjoy and share.{' '}
        </p>

        {saveToHomeText}
        <p>
          <span />
        </p>
      </Wrapper>
    );
  }
}

export default EndMsg;
