import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';

require("./contact.less");

export default class Contact extends Component {

  constructor() {
    super();
    this.state = {
      contact: []
    }
  }

  componentDidMount() {
    var that = this;
    axios.get('http://localhost:8082/articles?articleType=CONTACT&language=' + localStorage.getItem('language')).then(function(response) {
      var result = response.data;
      that.setState({contact: result});
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

  render() {
    var that = this;
    return (
      <div className="container paddingTopBottom15 contact">
          <div className="row">
            <div className="col-md-12">
              <h2>Kontakt</h2>
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
                <select className="form-control" id="contact_type" defaultValue={0}>
                  <option value={0}>Frage</option>
                  <option value={1}>Presse & Media</option>
                  <option value={2}>Kooperation</option>
                </select>
            </div>
            <div className="form-group">
              <label htmlFor="firstname_familyname">Vorname Nachname*:</label>
              <input type="text" className="form-control" id="firstname_familyname" placeholder="Bitte geben Sie Ihren Vor- und Nachnamen ein." />
            </div>
            <div className="form-group">
              <label htmlFor="e_mail">E-Mailadresse*:</label>
              <input type="email" className="form-control" id="e_mail" placeholder="Bitte geben Sie Ihre E-mailadresse ein." />
            </div>
            <div className="form-group">
              <label htmlFor="phone_number">Telefonnummer:</label>
              <input type="text" className="form-control" id="phone_number" placeholder="Bitte geben Sie Ihre Telefonnummer ein." />
            </div>
            <div className="form-group">
              <label htmlFor="personal_message">Ihre Nachricht*:</label>
              <textarea className="form-control" rows="10" id="personal_message" placeholder="Bitte geben Sie Ihre Nachricht ein." />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-default">Absenden</button>
            </div>
          </div>
        </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
