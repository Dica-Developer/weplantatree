import axios from 'axios';
import React, {Component} from 'react';
import {render} from 'react-dom';
import Accounting from 'accounting';
import Boostrap from 'bootstrap';
import moment from 'moment';
import {browserHistory} from 'react-router';
import {getTextForSelectedLanguage} from '../../language/LanguageHelper';
import {htmlDecode} from '../../language/HtmlHelper';

export default class AmountProjectDate extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var project;
    var name;
    if (this.props.content.projectArticle == null) {
      project = <span>Eigene Pflanzung</span>;
    } else {
      project = this.props.content.projectArticle.project.name;
    }

    if (this.props.showName) {
      name = '(' + htmlDecode(this.props.content.owner.name) + ')';
    } else {
      name = '';
    }
    return (
      <div className="rankingSummary">
        <p>
          <span className="bold">{counterpart.translate('NUMBER')}:&nbsp;</span>{Accounting.formatNumber(this.props.content.amount, 0, '.', ',')}&nbsp;{name}<br/>
          <span className="bold">{counterpart.translate('PROJECT')}:&nbsp;</span>
          {project}<br/>
          <span className="bold">{counterpart.translate('DATE')}:&nbsp;</span>
          <span >{moment(this.props.content.plantedOn).format('DD.MM.YYYY')}</span>
        </p>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
