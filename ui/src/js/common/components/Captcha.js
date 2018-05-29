import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import axios from 'axios';

import Notification from './Notification';
import IconButton from './IconButton';
import InputText from './InputText';

require('./captcha.less');

export default class Captcha extends Component {
  constructor() {
    super();
    this.state = {
      captchaToken: '',
      captchaImg: null,
      userInput: ''
    };
  }

  componentDidMount() {
    this.createCaptchaToken();
  }

  updateUserInput(event) {
    this.setState({
      userInput: event.target.value
    });
  }

  updateCaptchaToken() {
    this.createCaptchaToken();
  }

  createCaptchaToken() {
    var that = this;
    axios.get('http://localhost:8081/captcha/generate').then(function(response) {
      that.setState({
        captchaToken: response.data[0],
        captchaImg: response.data[1]
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

  validateCaptcha() {
    if (this.state.captchaToken != this.state.userInput) {
      this.refs.notification.addNotification('Captcha ungültig!', 'Der eingegebene Text stimmt nicht mit den Zeichen im Bild überein', 'error');
      this.updateCaptchaToken();
      return false;
    } else {
      return true;
    }
  }

  render() {
    return (
      <div className="captcha">
        <img className="captchaImage" src={'data:image/jpg;base64,' + this.state.captchaImg}/>
        <p>Bitte hier die 4 Zeichen aus dem Bild eingeben:</p>
        <div className="inputWrapper">
          <input type="text" className="form-control inputField" value={this.state.userInput} onChange={this.updateUserInput.bind(this)}/>
          <IconButton glyphIcon="glyphicon-refresh" onClick={this.updateCaptchaToken.bind(this)}/>
        </div>
        <Notification ref="notification"/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
