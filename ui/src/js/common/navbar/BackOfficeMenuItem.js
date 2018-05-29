import React, {Component} from 'react';
import {browserHistory} from 'react-router';

export default class BackOfficeMenuItem extends Component {
  constructor() {
    super();
  }

  linkTo(url) {
    this.props.hide();
    browserHistory.push(url);
  }

  render() {
    return (
      <div className={localStorage.getItem('isAdmin') == 'true' ? 'menu-item' : 'no-display'}><a role="button" onClick={() => {
        this.linkTo(this.props.hash);
      }}>
        {this.props.children}
      </a></div>
    );
  }
}
