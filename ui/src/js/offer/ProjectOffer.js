import React, {Component} from 'react';
import {render} from 'react-dom';
import axios from 'axios';
import Boostrap from 'bootstrap';

import Notification from '../common/components/Notification';
import IconButton from '../common/components/IconButton';
import InputText from '../common/components/InputText';
import TextArea from '../common/components/TextArea';
import Captcha from '../common/components/Captcha';
import RadioButton from '../common/components/RadioButton';

export default class ProjectOffer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      first: '',
      name: '',
      mail: '',
      comment: ''
    };
  }

  updateValue(toUpdate, value) {
    this.setState({[toUpdate]: value});
  }

  updateAfforestation(event) {
    if (event.target.value == '1') {
      this.setState({isAfforestation: true});
    } else {
      this.setState({isAfforestation: false});
    }
  }

  updateSelling(event) {
    if (event.target.value == '1') {
      this.setState({isSelling: true});
    } else {
      this.setState({isSelling: false});
    }
  }

  updateLeasing(event) {
    if (event.target.value == '1') {
      this.setState({isLeasing: true});
    } else {
      this.setState({isLeasing: false});
    }
  }

  sendOffer() {
    if (this.refs.captcha.validateCaptcha()) {
      var that = this;
      var config = {
        headers: {
          'X-AUTH-TOKEN': localStorage.getItem('jwt')
        }
      };

      axios.post('http://localhost:8081/project/offer', this.state, config).then(function(response) {
        console.log('call child');
        that.props.setThankYou(true);
      }).catch(function(response) {
        that.refs.notification.addNotification('Ein Fehler ist aufgetreten!', 'Bitte füll alle notwendigen Felder aus!', 'error');
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
  }

  render() {
    return (
      <div className="projectOffer container">
        <div className="row">
          <div className="col-md-12 item-align-start">
            <h1>Fläche anbieten</h1>
            <p>Wir würden gern Flächen kaufen, um sie zu langfristig, gemeinnützig, nachhaltig betriebenen Wäldern umzuwandeln. Wir suchen Flächen, die:</p>
            <ul>
              <li>für eine Aufforstung in Frage kommen, für die wir also eine Aufforstungsgenehmigung bekommen können (also keine Trockenrasen oder Streuobstwiesen)</li>
              <li>zwischen 2 und 20 Hektar groß sind, im Idealfall an einer Straße / Fahrradweg liegen und gut von Publikum eingesehen werden können</li>
              <li>über einen Kauf oder Schenkung an I Plant A Tree gebunden werden können</li>
              <li>idealerweise Mischflächen sind, wo bereits Wald steht, aber noch anliegende Flächen aufgeforstet werden können</li>
              <li>möglichst in den neuen Bundesländern liegen (am besten in Sachsen-Anhalt, Sachsen, Thüringen und rund um Berlin) - aber wir suchen auch in anderen Bundesländern, in Abhängigkeit vom Preis</li>
              <li>nach Möglichkeit maximal 4.000 Euro/ha kosten</li>
            </ul>
            <h3>Bitte trage die nötigen Daten in das Formular ein. Wir werden uns dann bei Dir melden.</h3>
          </div>
          <div className="form-group">
              <label htmlFor="firstname_familyname">Vorname Nachname*:</label>
              <InputText cssclass="form-control" toUpdate="name" id="firstname_familyname" placeholderText="Bitte geben Sie Ihren Vor- und Nachnamen ein." updateValue={this.updateValue.bind(this)}/>
            </div>
          <div className="form-group">
              <label htmlFor="e_mail">E-Mailadresse*:</label>
              <InputText cssclass="form-control" id="e_mail" toUpdate="name" placeholderText="Bitte geben Sie Ihre E-mailadresse ein." updateValue={this.updateValue.bind(this)}/>
          </div>
          <div className="form-group">
              <label htmlFor="message">Nachricht*:</label>
              <TextArea cssclass="form-control" id="message" toUpdate="comment" placeholderText="Bitte geben Sie Ihre Nachricht ein." updateValue={this.updateValue.bind(this)}/>
          </div>
          <div className="col-md-12 item-align-start">
            <Captcha ref="captcha"/>
          </div>
          <div className="col-md-12 item-align-start">
            <IconButton text="Angebot abschicken" glyphIcon="glyphicon-envelope" onClick={this.sendOffer.bind(this)}/>
            <Notification ref="notification"/>
          </div>
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
