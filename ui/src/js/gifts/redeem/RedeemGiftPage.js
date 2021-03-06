import React, { Component } from 'react';
import RedeemGiftContent from '../RedeemGiftContent';

require('./giftRedeem.less');

export default class RedeemGiftPage extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="container paddingTopBottom15">
        <div className="row giftRedeem">
          <RedeemGiftContent redeemGift={this.props.route.redeemGift.bind(this)} showLoginSlide={this.props.route.showLoginSlide.bind(this)}></RedeemGiftContent>
        </div>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
