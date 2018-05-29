import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import Accounting from 'accounting';
import axios from 'axios';

import Notification from '../common/components/Notification';

export default class Overview extends Component {

  constructor(props) {
    super(props);
  }

  setPaymentOption(option) {
    if (option == 'creditcard' && (this.props.price < 1500)) {
      this.refs.notification.addNotification('Kreditkartenzahlung nicht möglich!', 'Kreditkartenzahlungen sind leider erst ab einem Betrag von 15€ möglich.', 'error');
    } else {
      this.props.setPaymentOption(option);
    }
  }

  renderPaypalButton() {
    let that = this;
    paypal.Button.render({
      env: 'production', // sandbox | production

      style: {
        // layout: 'vertical',
        label: 'pay',
        size: 'responsive', // small | medium | responsive
        shape: 'rect', // pill | rect
        color: 'silver', // gold | blue | silver | black
        tagline: false,
        fundingicons: true, // optional
      },
      // Options:
      // - paypal.FUNDING.CARD
      // - paypal.FUNDING.CREDIT
      // - paypal.FUNDING.ELV

      funding: {
        allowed: [paypal.FUNDING.CARD],
        disallowed: [paypal.FUNDING.ELV]
      },

      // PayPal Client IDs - replace with your own
      // Create a PayPal app: https://developer.paypal.com/developer/applications/create
      client: {
        // sandbox: 'AQIg9TONrZNfKMgZ3F7OroWWqx3yQMGXjQubo2uvgiZTq9TsA7ReOhMGAzNJC4BVeoPwLd6XgezKGGfU',
        production: 'AY7q3cX-S1w60RV7sbCPo27zHabr-COtyAWUGJibBL9hkos4eg25PyskST_uYLXsPxYkBo2guws927Ky'
      },

      // Show the buyer a 'Pay Now' button in the checkout flow
      commit: true,

      // payment() is called when the button is clicked
      payment: function(data, actions) {

        // Make a call to the REST api to create the payment
        return actions.payment.create({
          transactions: [{
            // amount: { total: Accounting.formatNumber(that.props.price / 100, 2, ',', '.'), currency: 'EUR' }
            amount: {
              total: Accounting.formatNumber(0.1, 2, ',', '.'),
              currency: 'EUR'
            }
          }]
        });
      },

      // onAuthorize() is called when the buyer approves the payment
      onAuthorize: function(data, actions) {

        // Make a call to the REST api to execute the payment
        return actions.payment.execute().then(function(response) {
          //TODO: implement if/elso for paypal or creditcard payment and set paymentMethod 'PP' or 'KK'
          let paymentData = {
            cartId: that.props.cartId,
            giftId: that.props.giftId,
            company: '',
            companyAddon: '',
            salutation: '',
            title: '',
            forename: response.payer.payer_info.first_name,
            name: response.payer.payer_info.last_name,
            street: response.payer.payer_info.shipping_address.line1 + response.payer.payer_info.shipping_address.line2,
            country: response.payer.payer_info.shipping_address.country_code,
            city: response.payer.payer_info.shipping_address.city,
            zip: response.payer.payer_info.shipping_address.postal_code,
            mail: response.payer.payer_info.email,
            comment: '',
            paymentMethod: 'PP',
            transactionId: response.transactions[0].related_resources[0].sale.id
          };

          axios.post('http://localhost:8081/pay', paymentData, {}).then(function(response) {
            that.refs.notification.addNotification('Zahlung erfolgreich abgeschlossen!', 'Vielen Dank für deine Spende.', 'success');
            that.props.resetPlantBag();
          }).catch(function(response) {
            if (response instanceof Error) {
              console.error('Error', response.message);
            } else {
              console.error(response.data);
              console.error(response.status);
              console.error(response.headers);
              console.error(response.config);
            }
            console.error('Payment failed');
          });
        });
      }

    }, '#paypal-button-container');
  }

  componentDidMount() {
    this.renderPaypalButton();
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <h1>Kasse</h1>
          <div>
            Sicher spenden für "I plant a tree". Das Senden der Daten ist mit HTTPS verschlüsselt. Bitte überprüfen sie die Richtigkeit Ihrer Angaben, denn diese finden sich in Ihrer Spendenquittung wieder. Achten sie auch unbedingt auf die richtige Syntax Ihrer Emailadresse - an diese wird die Spendenquittung versendet.
          </div>
          <div className="bold choose">
            Zahlungsmethode wählen:
          </div>
          <div className="paymentOption">
            <a role="button" onClick={() => {
              this.setPaymentOption('sepa');
            }}>
              SEPA<br/>
              <img src="/assets/images/sepa.png" width="256" height="183"/>
            </a>
          </div>
          <div className="paymentOption">
            <div id="paypal-button-container">
            </div>
          </div>
          <div className="paymentOption">
            <a role="button" onClick={() => {
              this.setPaymentOption('creditcard');
            }}>
              KREDITKARTE<br/>
              <img src="/assets/images/visa.png" width="256" height="183"/>
            </a>
          </div>
          <Notification ref="notification"/>
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
