import axios from 'axios';
import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Accounting from 'accounting';
import Boostrap from 'bootstrap';
import moment from 'moment';
import {browserHistory} from 'react-router';
import {
  getTextForSelectedLanguage
} from '../../language/LanguageHelper';
import {
  htmlDecode
} from '../../language/HtmlHelper';

export default class NameAmountDate extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="rankingSummary">
        <p>
          <span className="name">{htmlDecode(this.props.name)}</span><br/>
          <span className="stats">B&auml;ume gepflant:&nbsp;{this.props.amount}</span><br/>
          <span className="stats">Datum:</span>
          <span className="stats">{moment(this.props.plantedOn).format('DD.MM.YYYY')}</span>
        </p>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
