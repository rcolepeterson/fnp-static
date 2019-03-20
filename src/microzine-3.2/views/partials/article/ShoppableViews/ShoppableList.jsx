import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import ShoppableItem from 'microzine-3.2/views/partials/article/ShoppableViews/ShoppableItem';
import MicrozineEvents from 'microzine-3.2/helpers/MicrozineEvents';
import Properties from 'microzine-3.2/helpers/MicrozineProperties';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  font-size: 16px;
  .shoppable_container {
    box-sizing: border-box;
    white-space: initial;
    overflow: hidden;
    transition: height 1s;
    padding-top: 10px;
    margin-top: -10px;
  }
  #seeMoreButton {
    font-size: 12px;
    height: 12px;
    color: $grey;
    display: block;
    margin: 9px 20px 3px 0;
    float: right;
    cursor: pointer;
    span {
      padding-left: 6px;
      position: relative;
    }
    svg {
      transform: rotate(90deg);
      width: 6px;
      height: 9px;
      &.expanded {
        transform: rotate(-90deg);
      }
    }
  }
  .featured_title {
    text-transform: uppercase;
    font-weight: bold;
    color: $black;
    position: relative;
    white-space: normal;
    padding: 15px 0 15px 10px;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    overflow: hidden;
  }
`;

class ShoppableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      seeBtn: 'See More'
    };

    this.shoppableItems = this.props.relatedProducts.map(
      articleRelatedProduct => {
        return (
          <ShoppableItem
            url={articleRelatedProduct.url}
            image={articleRelatedProduct.image_url}
            title={articleRelatedProduct.title}
            price={articleRelatedProduct.price}
            btnLabel={Properties.shoppableButtonLabel}
          />
        );
      },
      this
    );
    this.shadowItem =
      this.props.relatedProducts.length % 2 === 0 ? (
        ''
      ) : (
        <ShoppableItem shadowItem={true} />
      );
  }
  componentDidMount() {
    // since the cards will be in rows of 2 we can divide the amount
    // by 2 and see the height based on the css values
    this.shoppableContainer = document.querySelector('.shoppable_container');
    this.shoppableContainer.addEventListener(
      'transitionend',
      this.transitionend,
      false
    );
    this.shoppableContainer.addEventListener(
      'webkitTransitionEnd',
      this.transitionend,
      false
    );
  }
  expandList() {
    if (this.state.isExpanded) {
      this.setState({ isExpanded: false, seeBtn: 'See More' });
    } else {
      this.setState({ isExpanded: true, seeBtn: 'See Less' });
    }
  }
  componentWillUnmount() {
    this.shoppableContainer.removeEventListener(
      'transitionend',
      this.transitionend,
      false
    );
    this.shoppableContainer.removeEventListener(
      'webkitTransitionEnd',
      this.transitionend,
      false
    );
  }
  transitionend() {
    MicrozineEvents.dispatchEvent('shoppableanimated', null);
  }
  getHeight() {
    //42 for price, 45 for button and 27 for description, 20 for bottom margin
    this.width = document.body.clientWidth;
    let numberOfRows = Math.ceil(this.props.relatedProducts.length / 2);
    if (this.width >= 700) {
      //1/2 of max width 700 minus the margins and add the rest of the elements: (700/2) - 30) + (27 + 42 + 45 + 10) + 20
      if (this.state.isExpanded) {
        this.containerHeight = numberOfRows * 466;
      } else if (this.props.relatedProducts.length <= 2) {
        //account for negative margin
        this.containerHeight = 466 + 10;
      } else {
        //see more accounts for neg margin
        this.containerHeight = 466;
      }
    } else if (this.width < 375) {
      //this case is for small screens where the meta tag causes the body width to misrep the actual screen width
      if (this.state.isExpanded) {
        this.containerHeight =
          this.props.relatedProducts.length * (this.width + 111);
      } else if (this.props.relatedProducts.length <= 2) {
        this.containerHeight =
          this.props.relatedProducts.length * (this.width + 111) + 10;
      } else {
        this.containerHeight = 2 * (this.width + 111);
      }
    } else {
      //1/2  the width minus the margins and add the rest of the elements: (this.width / 2) - 30 + (27 + 42 + 45) + 20
      if (this.state.isExpanded) {
        this.containerHeight = numberOfRows * (this.width / 2 + 116);
      } else if (this.props.relatedProducts.length <= 2) {
        //account for neg margin
        this.containerHeight = this.width / 2 + 116 + 10;
      } else {
        //see more accounts for neg margin
        this.containerHeight = this.width / 2 + 116;
      }
    }
    return this.containerHeight + 'px';
  }
  render(props, state) {
    let containerHeight = { height: this.getHeight() };
    return (
      <Wrapper id="shoppable" className="card">
        <div>
          <span className="featured_title">
            {Properties.shoppableSectionLabel}
          </span>
          <div className="shoppable_container" style={containerHeight}>
            {this.shoppableItems}
            {this.shadowItem}
          </div>
          <a
            id="seeMoreButton"
            onClick={this.expandList.bind(this)}
            style={props.relatedProducts.length > 2 ? null : 'display: none'}>
            {state.seeBtn}
            <span>
              <svg
                className={state.isExpanded ? 'expanded' : ''}
                x="0px"
                y="0px"
                viewBox="0 0 14 23">
                <path
                  id="arrow-copy"
                  fill="#838383"
                  d="M0.7,22.3c-0.5-0.5-0.6-1.2-0.2-1.6l9.3-8.8l-9.3-9C0.1,2.4,0.2,1.7,0.7,1.2S2,0.6,2.4,1
                  l11.3,10.9c0,0,0,0,0,0l0,0L2.4,22.5C2,22.9,1.3,22.8,0.7,22.3"
                />
              </svg>
            </span>
          </a>
        </div>
      </Wrapper>
    );
  }
}

export default ShoppableList;
