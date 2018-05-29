import axios from 'axios';
import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';

import RedeemGiftContent from '../RedeemGiftContent';

require('./giftRedeem.less');

export default class RedeemGiftPage extends Component {
  constructor() {
    super();
  }

  render() {

    return (
      <div className="container paddingTopBottom15">
        <div className="row giftRedeem">
          <RedeemGiftContent></RedeemGiftContent>
        </div>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
