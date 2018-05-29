import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import {browserHistory} from 'react-router';
import axios from 'axios';
import Boostrap from 'bootstrap';

import ConsignorGiftItem from './ConsignorGiftItem';
import RecipientGiftItem from './RecipientGiftItem';
import RedeemGiftContent from '../RedeemGiftContent';
import IconButton from '../../common/components/IconButton';

require('./gifts.less');

export default class GiftOverview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userName: this.props.params.userName,
      consignorGifts: [],
      recipientGifts: []
    };
  }

  componentDidMount() {
    var that = this;
    axios.get('http://localhost:8081/gift/search/consignor?userName=' + this.state.userName).then(function(response) {
      var result = response.data;
      that.setState({consignorGifts: result});
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

    axios.get('http://localhost:8081/gift/search/recipient?userName=' + this.state.userName).then(function(response) {
      var result = response.data;
      that.setState({recipientGifts: result});
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

  linkTo(url) {
    browserHistory.push(url);
  }

  render() {
    return (
      <div className="container paddingTopBottom15">
        <div className="row gifts">
          <div className="col-md-12">
            <h1>Gutschein-Übersicht</h1>
            <h2>Erstellte Gutscheine:</h2>
            <div className="giftItem">
              <div>
                Code:
              </div>
              <div>
                Status:
              </div>
              <div>
                Eingelöst von:
              </div>
            </div>
              {this.state.consignorGifts.map(function(gift, i) {
                return (<ConsignorGiftItem gift={gift}  key={i}/>);
              })}
            <h2>Eingelöste Gutscheine:</h2>
            <div className="giftItem">
              <div>
                Code:
              </div>
              <div>
                Erstellt von:
              </div>
            </div>
              {this.state.recipientGifts.map(function(gift, i) {
                return (<RecipientGiftItem gift={gift}  key={i}/>);
              })}
          </div>
          <div className="col-md-12 createGift">
            <h2>Gutschein erstellen</h2>
            <IconButton className="iconButton" text="Gutschein erstellen" glyphIcon="glyphicon-gift" onClick={() => {
              this.linkTo('/plantGift/5');
            }}/>
          </div>
          <RedeemGiftContent />
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
