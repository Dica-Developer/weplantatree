import React, {Component} from 'react';
import {browserHistory} from 'react-router';

require('./footer.less');

export default class Footer extends Component {

  linkTo(url) {
    browserHistory.push(url);
  }

  render() {
    return (
      <div className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-2">
              <a role="button" onClick={() => {
                this.linkTo('/aboutUs');
              }}>
                ÜBER UNS
              </a>
              <a role="button" onClick={() => {
                this.linkTo('/faq');
              }}>
                FAQ
              </a>
            </div>
            <div className="col-md-2">
              <a role="button" onClick={() => {
                this.linkTo('/partner');
              }}>
                PARTNER
              </a>
              <a role="button" onClick={() => {
                this.linkTo('/award');
              }}>
                AUSZEICHNUNGEN
              </a>
            </div>
            <div className="col-md-2">
              <a role="button" onClick={() => {
                this.linkTo('/blog');
              }}>
                BLOG
              </a>
              <a role="button" onClick={() => {
                this.linkTo('/social');
              }}>
                SOCIAL
              </a>
            </div>
            <div className="col-md-2">
              <a role="button" onClick={() => {
                this.linkTo('/statistics');
              }}>
                ZAHLEN & FAKTEN
              </a>
              <a role="button" onClick={() => {
                this.linkTo('/financials');
              }}>
                FINANZEN
              </a>
            </div>
            <div className="col-md-2">
              <a role="button" onClick={() => {
                this.linkTo('/privacy');
              }}>
                DATENSCHUTZ
              </a>
              <a role="button" onClick={() => {
                this.linkTo('/terms');
              }}>
                AGB
              </a>
            </div>
            <div className="col-md-2">
              <a role="button" onClick={() => {
                this.linkTo('/contact');
              }}>
                KONTAKT
              </a>
              <a role="button" onClick={() => {
                this.linkTo('/imprint');
              }}>
                IMPRESSUM
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/* vim : set softtabstop = 2 : shiftwidth = 2 : expandtab */

