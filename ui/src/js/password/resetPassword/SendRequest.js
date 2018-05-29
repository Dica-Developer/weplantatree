import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

import Notification from '../../common/components/Notification';
import InputText from '../../common/components/InputText';
import IconButton from '../../common/components/IconButton';

export default class SendRequest extends Component {

  constructor(props) {
    super(props);
    this.state = {
      passwordOne: '',
      passwordTwo: '',
      name: '',
      linkValid: false,
      headLine: ''
    };
  }

  componentDidMount(){
    var that = this;
    axios.post('http://localhost:8081/password_reset_verify' + this.props.search + '&language=' + localStorage.getItem('language')).then(function(response) {
      var headLine = 'Passwortänderung für ' + response.data;
      that.setState({headLine: headLine, linkValid: true});
    }).catch(function(response) {
      that.setState({headLine: counterpart.translate(response.data.errorInfos[0].errorCode), linkValid: false});
    });
  }

  updateValue(toUpdate, value) {
    this.setState({
      [toUpdate]: value
    });
  }

  resetPassword() {
    if (this.state.passwordOne != this.state.passwordTwo) {
      this.refs.notification.addNotification('Passwörter stimmen nicht überein!', 'Das angegebene Passwort stimmt nicht mit der Bestätigung überein.', 'error');
    }else if(this.state.passwordOne.length < 6 ){
      this.refs.notification.addNotification('Passwort zu kurz!', 'Das angegebene Passwort ist zu kurz, verwende bitte mind. 6 Zeichen', 'error');
    }else {
      var that = this;
      axios.post('http://localhost:8081/password_reset' + this.props.search + '&language=' + localStorage.getItem('language') + '&password=' + this.state.passwordOne).then(function(response) {
        that.props.setResetted();
      }).catch(function(response) {
        // that.refs.notification.addNotification('Fehler beim Zurücksetzen des Passworts!', response.data, 'error');
        that.refs.notification.handleError(response);
      });
    }
  }

  render() {
    var headLine = this.state.headLine;
    var inputForm;
    if(this.state.linkValid){
      inputForm = <div className="form">
        Gib hier dein neues Passwort an, verwende bitte mind. 6 Zeichen.<br/><br/>
        Passwort:
        <InputText type="password" toUpdate="passwordOne" updateValue={this.updateValue.bind(this)}/>
          Passwort(Bestätigen):
        <InputText type="password" toUpdate="passwordTwo" updateValue={this.updateValue.bind(this)}/>
        <br/>
        <IconButton text="PASSWORT ZURÜCKSETZEN" glyphIcon="glyphicon-cog" onClick={this.resetPassword.bind(this)}/>
      </div>;
    }else{
      inputForm = '';
    }

    return (
      <div className="col-md-12">
        <h1>{headLine}</h1>
          {inputForm}
        <Notification ref="notification"/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
