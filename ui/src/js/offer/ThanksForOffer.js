import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';

import IconButton from '../common/components/IconButton';

require('./projectOffer.less');

export default class ProjectOfferPage extends Component {

  constructor() {
    super();

  }

  setThankYou(){
    this.props.setThankYou(false);
  }

  render() {
    return (
      <div className="col-md-12">
        <h2 className="thanks">Vielen Dank für das Anbieten einer Projekt!</h2>
        <br/>
        <div className="align-center">
          <IconButton text="Weiteres Angebot abgeben" glyphIcon="glyphicon-backward" onClick={this.setThankYou.bind(this)}/>
        </div>
        <br/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
