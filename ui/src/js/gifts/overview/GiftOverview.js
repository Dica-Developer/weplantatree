import axios from 'axios';
import counterpart from 'counterpart';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Notification from '../../common/components/Notification';
import { getConfig } from '../../common/RestHelper';
import ConsignorGiftItem from './ConsignorGiftItem';
import RecipientGiftItem from './RecipientGiftItem';

require('./gifts.less');

export default class GiftOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: this.props.params.userName,
      consignorGifts: [],
      recipientGifts: [],
      restConfig: getConfig()
    };
  }

  componentDidMount() {
    var that = this;
    let config = getConfig();
    axios
      .get('http://localhost:8081/gift/search/consignor?userName=' + encodeURIComponent(this.state.userName), this.state.restConfig)
      .then(function(response) {
        var result = response.data;
        that.setState({ consignorGifts: result });
      })
      .catch(function(error) {
        that.refs.notification.handleError(error);
      });

    axios
      .get('http://localhost:8081/gift/search/recipient?userName=' + encodeURIComponent(this.state.userName), this.state.restConfig)
      .then(function(response) {
        var result = response.data;
        that.setState({ recipientGifts: result });
      })
      .catch(function(error) {
        that.refs.notification.handleError(error);
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
            <h1>{counterpart.translate('NAVBAR.VOUCHERS')}</h1>
          </div>
          <div className="col-md-6">
            <div
              className="createGift"
              onClick={() => {
                this.linkTo('/plantGift/5');
              }}
            >
              <span className={'glyphicon glyphicon-gift'} aria-hidden="true"></span>
              <p>{counterpart.translate('CREATE_GIFT')}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div
              className="createGift"
              onClick={() => {
                this.linkTo('/gift/redeem');
              }}
            >
              <span className={'glyphicon glyphicon-retweet'} aria-hidden="true"></span>
              <p>{counterpart.translate('REDEEM_GIFT')}</p>
            </div>
          </div>
          <div className="col-md-12">
            <h2>{counterpart.translate('CREATED_GIFTS')}</h2>
            <div className="giftItem giftHeader">
              <div>{counterpart.translate('CODE')}</div>
              <div>{counterpart.translate('TREES')}</div>
              <div>{counterpart.translate('PRICE')}</div>
              <div>{counterpart.translate('REDEEMED_BY')}</div>
              <div></div>
            </div>
            {this.state.consignorGifts.map(function(gift, i) {
              return <ConsignorGiftItem gift={gift} key={i} />;
            })}
            <h2>{counterpart.translate('REDEEMED_GIFTS')}</h2>
            <div className="giftItem giftHeader">
              <div>{counterpart.translate('CODE')}:</div>
              <div>{counterpart.translate('TREES')}:</div>
              <div>{counterpart.translate('PRICE')}:</div>
              <div>{counterpart.translate('CREATED_BY')}:</div>
            </div>
            {this.state.recipientGifts.map(function(gift, i) {
              return <RecipientGiftItem gift={gift} key={i} />;
            })}
          </div>
        </div>
        <Notification ref="notification" />
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
