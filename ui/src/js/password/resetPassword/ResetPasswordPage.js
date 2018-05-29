import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';

import SendRequest from './SendRequest';
import RequestSent from './RequestSent';

require('./resetPasswordPage.less');

export default class ResetPasswordPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isResetted: false
    };
  }
  setResetted() {
    this.setState({
      isResetted: true
    });
  }

  render() {
    var content;
    if (this.state.isResetted) {
      content = <RequestSent/>;
    } else {
      content = <SendRequest search={this.props.location.search} setResetted={this.setResetted.bind(this)}/>;
    }
    return (
      <div className="container paddingTopBottom15">
        <div className="row resetPasswordPage">
          {content}
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
