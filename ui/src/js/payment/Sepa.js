import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import axios from 'axios';
import Accounting from 'accounting';
import Boostrap from 'bootstrap';
import $ from 'jquery';
import {
  browserHistory
} from 'react-router';

import Notification from '../common/components/Notification';
import LoadingSpinner from '../common/components/LoadingSpinner';
import IconButton from '../common/components/IconButton';
import InputText from '../common/components/InputText';
import {
  getConfig
} from '../common/RestHelper';

export default class Sepa extends Component {

  constructor(props) {
    super(props);
    this.state = {
      paymentData: {
        cartId: this.props.cartId,
        giftId: this.props.giftId,
        company: '',
        companyAddon: '',
        salutation: '',
        title: '',
        forename: '',
        name: '',
        street: '',
        country: 'DE',
        city: '',
        zip: '',
        mail: '',
        receipt: 'sofort',
        comment: '',
        paymentMethod: 'SEPA',
        iban: 'TE01567891011121314151',
        bic: 'DEUTDEUTDEU'
      },
      paymentDone: false
    };

  }

  componentDidMount() {
    this.refs.select.options[0].selected = true;
  }

  updateValue(toUpdate, value) {
    var key = toUpdate;
    var val = value;
    var obj = this.state.paymentData;
    obj[key] = val;
    this.setState({
      paymentData: obj
    });
  }

  updateSalutation(event) {
    var key = 'salutation';
    var val = event.target.value;
    var obj = this.state.paymentData;
    obj[key] = val;
    this.setState({
      paymentData: obj
    });
  }

  payPlantBag() {
    this.refs['spinner'].showSpinner();
    var that = this;
    var config = getConfig();
    axios.post('http://localhost:8081/pay', this.state.paymentData, config).then(function(response) {
      $(that.refs['payment-row']).fadeOut(200);
      that.refs['spinner'].hideSpinner();
      that.refs.notification.addNotification('Zahlung erfolgreich abgeschlossen!', 'Vielen Dank für deine Spende.', 'success');
      that.props.resetPlantBag();
      that.setState({
        paymentDone: true
      });
    }).catch(function(error) {
      that.refs['spinner'].hideSpinner();
      that.refs.notification.handleError(error);
    });
  }

  switchToGiftOverview() {
    browserHistory.push('/gifts/' + localStorage.getItem('username'));
  }

  render() {
    var header = '';
    if (this.state.paymentDone) {
      header = <div><h1>Zahlung erfolgreich abgeschlossen!</h1>Folgende Daten wurden an die Bank für Sozialwirtschaft übermittelt:</div>;
      if (JSON.parse(localStorage.getItem('isGift'))) {
        header = <div><h1>Zahlung erfolgreich abgeschlossen!</h1>Deinen Gutschein-Code findest du<a role="button" onClick={this.switchToGiftOverview.bind(this)}> hier</a><br/>Folgende Daten wurden an die Bank für Sozialwirtschaft übermittelt:</div>;
      }else{
        header = <div><h1>Zahlung erfolgreich abgeschlossen!</h1>Folgende Daten wurden an die Bank für Sozialwirtschaft übermittelt:</div>;
      }
    } else {
      header = <h1>SEPA Lastschrift</h1>;
    };

    return (
      <div className="payment-data">
        <div className="row">
          <div className="col-md-12">
            {header}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-6">
                <label className="input-label">Firma</label>
              </div>
              <div className="col-md-6">
                <InputText toUpdate="company" updateValue={this.updateValue.bind(this)} disabled={this.state.paymentDone}/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label className="input-label">Unternehmenzusatz</label>
              </div>
              <div className="col-md-6">
                <InputText toUpdate="companyAddon" updateValue={this.updateValue.bind(this)} disabled={this.state.paymentDone}/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label className="input-label">Anrede</label>
              </div>
              <div className="col-md-6">
                <select onChange={this.updateSalutation.bind(this)} ref="select" disabled={this.state.paymentDone}>
                  <option value="" disabled>Bitte auswählen</option>
                  <option value="1">Herr</option>
                  <option value="2">Frau</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label className="input-label">Titel</label>
              </div>
              <div className="col-md-6">
                <InputText toUpdate="title" updateValue={this.updateValue.bind(this)} disabled={this.state.paymentDone}/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label className="input-label">Vorname *</label>
              </div>
              <div className="col-md-6">
                <InputText toUpdate="forename" updateValue={this.updateValue.bind(this)} disabled={this.state.paymentDone}/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label className="input-label">Nachname *</label>
              </div>
              <div className="col-md-6">
                <InputText toUpdate="name" updateValue={this.updateValue.bind(this)} disabled={this.state.paymentDone}/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label className="input-label">Straße *</label>
              </div>
              <div className="col-md-6">
                <InputText toUpdate="street" updateValue={this.updateValue.bind(this)} disabled={this.state.paymentDone}/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label className="input-label">Land</label>
              </div>
              <div className="col-md-6">
                Deutschland ({this.state.paymentData.country})
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label className="input-label">Ort *</label>
              </div>
              <div className="col-md-6">
                <InputText toUpdate="city" updateValue={this.updateValue.bind(this)} disabled={this.state.paymentDone}/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label className="input-label">PLZ *</label>
              </div>
              <div className="col-md-6">
                <InputText toUpdate="zip" updateValue={this.updateValue.bind(this)} disabled={this.state.paymentDone}/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label className="input-label">E-Mail *</label>
              </div>
              <div className="col-md-6">
                <InputText toUpdate="mail" updateValue={this.updateValue.bind(this)} disabled={this.state.paymentDone}/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label className="input-label">Betrag</label>
              </div>
              <div className="col-md-6">
                <span className="bold">{Accounting.formatNumber(this.props.price / 100, 2, '.', ',')}&nbsp;€</span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label className="input-label">IBAN *</label>
              </div>
              <div className="col-md-6">
                {this.state.paymentData.iban}
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label className="input-label">BIC *</label>
              </div>
              <div className="col-md-6">
                {this.state.paymentData.bic}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="payment-info">
              Hier ist noch platz für einen Text, Bild oder irgendwas anderes.
            </div>
          </div>
        </div>
        <div ref="payment-row" className="row">
          <div className="col-md-6 payment-row">
            <IconButton glyphIcon="glyphicon-euro" text="BESTÄTIGEN" onClick={this.payPlantBag.bind(this)}/>
          </div>
          <div className="col-md-6"></div>
        </div>
        <LoadingSpinner ref="spinner"/>
        <Notification ref="notification"/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
