import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';

import IconButton from '../../components/IconButton';
import Captcha from '../../../common/components/Captcha';
import Notification from '../../components/Notification';

require('./contact.less');

export default class Contact extends Component {

  constructor() {
    super();
    this.state = {
      contact: [],
      form: {
        reason: 'Frage',
        name: '',
        mail: '',
        phone: '',
        message: ''
      }
    };
  }

  componentDidMount() {
    var that = this;
    axios.get('http://localhost:8082/articles?articleType=CONTACT&language=' + localStorage.getItem('language')).then(function(response) {
      var result = response.data;
      that.setState({
        contact: result
      });
    }).catch(function(response) {
      if (response instanceof Error) {
        console.error('Error', response.message);
      } else {
        console.error(response.data);
        console.error(response.status);
        console.error(response.headers);
        console.error(response.config);
      }
    });
  }

  submit() {
    if (this.validateForm()) {
      var that = this;
      axios.post('http://localhost:8081/contact', this.state.form).then(function(response) {
        that.refs.notification.addNotification('Kontakt-Anfrage wurde versandt!', 'Die Kontaktanfrage wurde erfolgreich übermittelt. Wir werden uns bald bei dir melden!', 'success');
      }).catch(function(response) {
        that.refs.notification.addNotification('Bei der Übermittlung ist ein Fehler aufgetreten!', 'Bitte versuche es noch einmal.', 'error');
      });
    } else {
      this.refs.notification.addNotification('Fehler!', 'Bitte füll alle notwendigen(mit einem * markierte) Felder aus!', 'error');
    }
  }

  validateForm() {
    if (this.state.form.name === '' || this.state.form.mail === '' || this.state.form.message === '') {
      return false;
    }
    return true;
  }

  updateValue(toUpdate, event){
    this.state.form[toUpdate] = event.target.value;
    this.forceUpdate();
  }

  render() {
    var that = this;
    return (
      <div className="container paddingTopBottom15 contact">
          <div className="row">
            <div className="col-md-12">
              <h1>Kontakt</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div>
                {this.state.contact.map(function(contact, i) {
                  return ( <div key={i} ><p className="title">{contact.title}</p><p dangerouslySetInnerHTML={{
                    __html: contact.intro}}></p>
                </div>);
                })}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-group">
              <label htmlFor="contact_type">Ihr Anliegen:</label>
                <select className="form-control" id="contact_type" defaultValue={0} onChange={(e) => this.updateValue('reason', e)}>
                  <option value={'Frage'}>Frage</option>
                  <option value={'Presse & Media'}>Presse & Media</option>
                  <option value={'Kooperation'}>Kooperation</option>
                </select>
            </div>
            <div className="form-group">
              <label htmlFor="firstname_familyname">Vorname Nachname*:</label>
              <input type="text" className="form-control" id="firstname_familyname" placeholder="Bitte geben Sie Ihren Vor- und Nachnamen ein." onBlur={(e) => this.updateValue('name', e)}/>
            </div>
            <div className="form-group">
              <label htmlFor="e_mail">E-Mailadresse*:</label>
              <input type="email" className="form-control" id="e_mail" placeholder="Bitte geben Sie Ihre E-mailadresse ein." onBlur={(e) => this.updateValue('mail', e)}/>
            </div>
            <div className="form-group">
              <label htmlFor="phone_number">Telefonnummer:</label>
              <input type="text" className="form-control" id="phone_number" placeholder="Bitte geben Sie Ihre Telefonnummer ein." onBlur={(e) => this.updateValue('phone', e)} />
            </div>
            <div className="form-group">
              <label htmlFor="personal_message">Ihre Nachricht*:</label>
              <textarea className="form-control" rows="10" id="personal_message" placeholder="Bitte geben Sie Ihre Nachricht ein." onBlur={(e) => this.updateValue('message', e)}/>
            </div>
            <div className="col-md-12 item-align-start">
              <Captcha ref="captcha"/>
            </div>
            <div className="form-group">
              <IconButton text="Abschicken" glyphIcon="glyphicon-envelope" onClick={this.submit.bind(this)}/>
            </div>
          </div>
          <Notification ref="notification"/>
        </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
