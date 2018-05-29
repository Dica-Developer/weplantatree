import React, {Component} from 'react';
import {render} from 'react-dom';
import NotificationSystem from 'react-notification-system';
import Boostrap from 'bootstrap';

import Overview from './Overview';
import Sepa from './Sepa';
import CreditCard from './CreditCard';

require('./paymentPage.less');

export default class PaymentPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      paymentOption: '',
      plantBag: JSON.parse(localStorage.getItem('plantBag')),
      cartId: this.props.params.cartId,
      giftId: this.props.params.giftId
    };
  }

  setPaymentOption(option) {
    this.setState({paymentOption: option});
  }

  updateNavbar() {
    this.props.route.updateComponents();
  }

  resetPlantBag(){
    this.props.route.resetPlantBag();
  }

  render() {
    var content;
    var giftText = '';
    if (this.state.paymentOption == '') {
      content = <Overview price={this.state.plantBag.price} setPaymentOption={this.setPaymentOption.bind(this)} cartId={this.state.cartId} giftId={this.state.giftId} resetPlantBag={this.resetPlantBag.bind(this)}/>;
    } else if (this.state.paymentOption == 'sepa') {
      content = <Sepa price={this.state.plantBag.price} cartId={this.state.cartId} giftId={this.state.giftId} setPaymentOption={this.setPaymentOption.bind(this)} updateNavbar={this.updateNavbar.bind(this)} resetPlantBag={this.resetPlantBag.bind(this)}/>;
    } else if (this.state.paymentOption == 'creditcard') {
      content = <CreditCard price={this.state.plantBag.price} cartId={this.state.cartId} giftId={this.state.giftId} setPaymentOption={this.setPaymentOption.bind(this)} updateNavbar={this.updateNavbar.bind(this)} resetPlantBag={this.resetPlantBag.bind(this)}/>;
    }

    return (
      <div className="container paddingTopBottom15">
        <div className="paymentPage">
          {content}
          {giftText}
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
