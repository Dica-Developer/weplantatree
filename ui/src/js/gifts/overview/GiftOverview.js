import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import {browserHistory} from 'react-router';
import axios from 'axios';
import Boostrap from 'bootstrap';
import counterpart from 'counterpart';

import ConsignorGiftItem from './ConsignorGiftItem';
import RecipientGiftItem from './RecipientGiftItem';
import RedeemGiftContent from '../RedeemGiftContent';
import IconButton from '../../common/components/IconButton';
import Notification from '../../common/components/Notification';

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
      that.refs.notification.handleError(error.response);
    });

    axios.get('http://localhost:8081/gift/search/recipient?userName=' + this.state.userName).then(function(response) {
      var result = response.data;
      that.setState({recipientGifts: result});
    }).catch(function(response) {
    that.refs.notification.handleError(error.response);
    });
  }

  linkTo(url) {
    browserHistory.push(url);
  }

  render() {
    return (
      <div className="container paddingTopBottom15">
        <div className="row gifts">
          <div className="col-md-12 createGift">
            <h1>{counterpart.translate('CREATE_GIFT')}</h1>
            <IconButton className="iconButton" text={counterpart.translate('CREATE_GIFT')} glyphIcon="glyphicon-gift" onClick={() => {
              this.linkTo('/plantGift/5');
            }}/>
          </div>
          <RedeemGiftContent />
          <div className="col-md-12">
            <h1>{counterpart.translate('GIFT_OVERVIEW')}</h1>
            <h2>{counterpart.translate('CREATED_GIFTS')}:</h2>
            <div className="giftItem">
              <div>
                {counterpart.translate('CODE')}:
              </div>
              <div>
                {counterpart.translate('STATE')}:
              </div>
              <div>
                {counterpart.translate('REDEEMED_BY')}:
              </div>
            </div>
              {this.state.consignorGifts.map(function(gift, i) {
                return (<ConsignorGiftItem gift={gift}  key={i}/>);
              })}
            <h2>{counterpart.translate('REDEEMED_GIFTS')}:</h2>
            <div className="giftItem">
              <div>
                {counterpart.translate('CODE')}:
              </div>
              <div>
                {counterpart.translate('CREATED_BY')}:
              </div>
            </div>
              {this.state.recipientGifts.map(function(gift, i) {
                return (<RecipientGiftItem gift={gift}  key={i}/>);
              })}
          </div>
        </div>
        <Notification ref="notification"/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
