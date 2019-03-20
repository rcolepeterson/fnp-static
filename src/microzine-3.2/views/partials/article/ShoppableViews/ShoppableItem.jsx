import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import MicrozineEvents from 'microzine-3.2/helpers/MicrozineEvents';
import styled from 'styled-components';
import {
  colors,
  typeSizes,
  fontWeights
} from 'microzine-3.2/styles/designSystem';

const Wrapper = styled.a`
  .price {
    color: ${colors.grey};
    font-size: 12px;
    font-weight: ${fontWeights.regular};
    padding: 18px 0 15px;
    line-height: 12px;
  }
  button {
    color: #fff;
    font-size: ${typeSizes[1]};
    font-weight: ${fontWeights.semiBold};
    right: 0;
    width: 100%;
    margin: 0;
    position: relative;
    background-color: ${colors.brand};
    height: 30px;
    border: 0;
    text-transform: uppercase;
    outline: none;
    cursor: pointer;
  }
  &.shadow_item {
    div {
      pointer-events: none;
      background-color: ${colors.lightGrey};
      box-shadow: none;
      & > * {
        visibility: hidden;
      }
    }
  }
  div {
    position: relative;
    display: inline-block;
    width: calc(50% - 15px);
    margin: 0 0 10px 10px;
    overflow: hidden;
    vertical-align: top;
    background-color: #fff;

    @media (max-width: 374px) {
      width: calc(100% - 20px);
    }

    span {
      display: -webkit-box;
      font-weight: ${fontWeights.semiBold};
      padding-bottom: 100%;
      -webkit-line-clamp: 1;
      overflow: hidden;
      white-space: normal;
      &.overlay {
        cursor: pointer;
      }
      &.title {
        padding: 6px 0 0;
        font-size: ${typeSizes[1]};
        line-height: 22px;
        text-transform: uppercase;
        height: 40px;
        -webkit-line-clamp: 2;
      }
    }
  }
`;

class ShoppableItem extends Component {
  constructor(props) {
    super(props);
    this.shoppableItemClass = this.props.shadowItem ? 'shadow_item' : '';
    this.price = <span className="price">$ - - -</span>;
    if (this.props.price) {
      if (Number.isInteger(this.props.price)) {
        this.props.price = `${this.props.price.toString()}.00`;
      }
      this.props.price = `$${this.props.price.toString()}`;
      this.price = <span className="price">{this.props.price}</span>;
    }
  }
  handleClick() {
    MicrozineEvents.dispatchEvent('shoppableitemclicked', {
      title: this.props.title,
      url: this.props.url
    });
    window.open(this.props.url, '_blank');
  }
  render(props) {
    return (
      <Wrapper
        className={`${this.shoppableItemClass} shoppable_item`}
        onClick={this.handleClick.bind(this)}>
        <div>
          <span
            className="overlay"
            style={
              this.props.image
                ? {
                    background: `url(${this.props.image}) 50% 50% no-repeat`,
                    backgroundSize: 'cover'
                  }
                : null
            }
          />
          <span className="title">{props.title}</span>
          {this.price}
          <button>{props.btnLabel}</button>
        </div>
      </Wrapper>
    );
  }
}

export default ShoppableItem;
