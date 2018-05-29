import React, {Component} from 'react';
import {browserHistory} from 'react-router';

export default class MenuItem extends Component {
  constructor() {
    super();
  }

  linkTo(url) {
    this.props.hide();
    browserHistory.push(url);
  }

  render() {
    var link;
    if (this.props.inactive) {
      link = <span className="inactive">{this.props.children}</span>;
    } else {
      link = <a role="button" onClick={() => {
        this.linkTo(this.props.hash);
      }}>
        {this.props.children}
      </a>;
    };
    return (
      <div className="menu-item">{link}</div>
    );
  }
}
