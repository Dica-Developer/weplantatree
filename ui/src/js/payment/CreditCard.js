import React, {Component} from 'react';
import {render} from 'react-dom';
import axios from 'axios';
import Accounting from 'accounting';
import Boostrap from 'bootstrap';

import Notification from '../common/components/Notification';
import LoadingSpinner from '../common/components/LoadingSpinner';
import IconButton from '../common/components/IconButton';
import InputText from '../common/components/InputText';
import {getConfig} from '../common/RestHelper';

export default class CreditCard extends Component {

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
        paymentMethod: 'KK'
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
    this.setState({paymentData: obj});
  }

  updateSalutation(event) {
    var key = 'salutation';
    var val = event.target.value;
    var obj = this.state.paymentData;
    obj[key] = val;
    this.setState({paymentData: obj});
  }

  payPlantBag() {
    this.refs['spinner'].showSpinner();
    var that = this;
    var config = getConfig();
    axios.post('http://localhost:8081/validateCC', this.state.paymentData, config).then(function(response) {
      // $(that.refs['payment-row']).fadeOut(200);
      // that.refs["spinner"].hideSpinner();
      // that.refs.notification.addNotification('Zahlung erfolgreich abgeschlossen!', 'Vielen Dank für deine Spende.', 'success');
      // that.setState({paymentDone: true});
      that.refs['submitForm'].click();
    }).catch(function(error) {
      that.refs['spinner'].hideSpinner();
      that.refs.notification.handleError(error);
    });
  }

  render() {
    return (
      <div className="payment-data">
        <div className="row">
          <div className="col-md-12">
            <h1>Kreditkartenzahlung</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-6">
                <label className="input-label">Unternehmen</label>
              </div>
              <div className="col-md-6">
                <InputText toUpdate="company" updateValue={this.updateValue.bind(this)} disabled={this.state.paymentDone}/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label className="input-label">Unternehmenszusatz</label>
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
          </div>
          <div className="col-md-6">
            <div className="payment-info">
              Hier ist noch platz für einen Text, Bild oder irgendwas anderes.<br/>
              sowas wie: du wirst auf die Seite der SpendenBank weiter geleitet um deine Kreditkartendaten eingeben zu können blabla
            </div>
          </div>
        </div>
        <div ref="payment-row" className="row">
          <div className="col-md-6 payment-row">
            <IconButton glyphIcon="glyphicon-euro" text="BESTÄTIGEN" onClick={this.payPlantBag.bind(this)}/>
          </div>
        </div>
        <div className="no-display">
          <form method="post" target="_blank" action="https://secure.spendenbank.de/spenden/?pid=api">
            <fieldset>
              <input type="text" name="oid" value="3941888"/>
              <input type="text" name="charset" value="UTF8"/>
              <input type="text" value={'http://localhost:8080/payCC/succes/' + this.state.paymentData.cartId} name="ret_success_url"/>
              <input type="text" value="http://localhost:8080/payCC/error" name="ret_error_url"/>
              <input type="text" name="firma" value={this.state.paymentData.company}/>
              <input type="text" name="firma_zusatz" value={this.state.paymentData.companyAddon}/>
              <input type="text" name="anrede" value={this.state.paymentData.salutation}/>
              <input type="text" name="titel" value={this.state.paymentData.title}/>
              <input type="text" name="vorname" value={this.state.paymentData.forename}/>
              <input type="text" name="nachname" value={this.state.paymentData.name}/>
              <input type="text" name="strasse" value={this.state.paymentData.street}/>
              <input type="text" name="land" value={this.state.paymentData.country}/>
              <input type="text" name="ort" value={this.state.paymentData.city}/>
              <input type="text" name="plz" value={this.state.paymentData.zip}/>
              <input type="text" name="email" value={this.state.paymentData.mail}/>
              <input type="text" name="betrag" value={this.props.price / 100}/>
              <input type="text" name="verwendungszweck" value="Spende I Plant A Tree"/>
              <input type="text" name="quittung" value="sofort"/>
              <input type="text" name="trackingcode" value={'Cart-ID: ' + this.state.paymentData.cartId}/>
              <input type="text" name="zahlungsart" value="KK"/>
            </fieldset>
            <input ref="submitForm" type="submit" name="send_donation" value="Spende senden"/>
          </form>
        </div>
        <LoadingSpinner ref="spinner"/>
        <Notification ref="notification"/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
