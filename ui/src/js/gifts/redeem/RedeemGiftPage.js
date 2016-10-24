import axios from 'axios';
import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import NavBar from '../../common/navbar/NavBar';
import Header from '../../common/header/Header';
import Footer from '../../common/Footer';

import IconButton from '../../common/components/IconButton';
import Notification from '../../common/components/Notification';

require("./giftRedeem.less");

export default class RedeemGiftPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRedeemed: false,
      code: '',
      part1: '',
      part2: '',
      part3: '',
      part4: ''
    }
  }

  redeemGift() {
    var that = this;
    this.createGiftCodeString();
    var config = {
      headers: {
        'X-AUTH-TOKEN': localStorage.getItem('jwt')
      }
    };
    axios.post('http://localhost:8081/gift/redeem?giftCode=' + this.state.code, {}, config).then(function(response) {
      that.setState({isRedeemed: true});
    }).catch(function(response) {
      that.refs.notification.addNotification('Ein Fehler ist aufgetreten!', response.data, 'error');
    });
  }

  createGiftCodeString() {
    var code = this.state.part1 + '-' + this.state.part2 + '-' + this.state.part3 + '-' + this.state.part4;
    this.state.code = code;
    this.forceUpdate();
  }

  updateInput(toUpdate, event) {
    this.setState({
      [toUpdate]: event.target.value
    });
  }

  trimAndSetValuesIfPossible(event) {
    var clipboardData, pastedData;

    event.stopPropagation();
    event.preventDefault();

    clipboardData = event.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');

    if (pastedData.length > 4) {
      var that = this;
      if (pastedData.replace(/[^-]/g, "").length == 3) {
        pastedData.split('-').map(function(item, i) {
          that.refs['part' + (i + 1)].value = item;
          that.setState({
            ['part' + (i + 1)]: item
          });
        });
      } else if (pastedData.replace(/[^ ]/g, "").length == 3) {
        pastedData.split(' ').map(function(item, i) {
          that.refs['part' + (i + 1)].value = item;
          that.setState({
            ['part' + (i + 1)]: item
          });
        });
      }
    } else if (pastedData.length <= 4) {
      this.refs['part1'].value = pastedData;
      this.setState({
        part1: pastedData
      });
    }
    this.forceUpdate();
  }

  render() {
    var content;
    if (this.state.isRedeemed) {
      content = <div className="col-md-12">
          <h2>Der Gutschein wurde eingelöst! Die Bäume wurden dir gutgeschrieben.</h2>
          </div>;
    } else {
      content = <div className="col-md-12">
          <h2>Gutschein einlösen</h2>
          <div className="code">
            Bitte gib hier Deinen 16 stelligen Gutschein-Code ein:<br/><br/>
            <input type="text" size="4" maxLength="4" ref="part1" onBlur={(event)=>{this.updateInput('part1', event)}} onPaste={this.trimAndSetValuesIfPossible.bind(this)}/>&nbsp;-&nbsp;
            <input type="text" size="4" maxLength="4" ref="part2" onBlur={(event)=>{this.updateInput('part2', event)}} />&nbsp;-&nbsp;
            <input type="text" size="4" maxLength="4" ref="part3" onBlur={(event)=>{this.updateInput('part3', event)}}/>&nbsp;-&nbsp;
            <input type="text" size="4" maxLength="4" ref="part4" onBlur={(event)=>{this.updateInput('part4', event)}}/>
            <br/><br/>
            <IconButton text="GUTSCHEIN EINLÖSEN" glyphIcon="glyphicon-gift" onClick={this.redeemGift.bind(this)}/>
          </div>
        </div>;
    }
    return (
      <div className="container paddingTopBottom15">
        <div className="row giftRedeem">
          {content}
        </div>
        <Notification ref="notification"/>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
