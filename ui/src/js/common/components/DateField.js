import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import DatePicker from 'react-bootstrap-date-picker';

import Notification from './Notification';

require('./dateField.less');

export default class DateField extends Component {

  constructor() {
    super();
    this.state = {
      value: new Date().toISOString()
    };
  }

  updateValue(value) {
    if (this.props.noFuture == 'true') {
      var dateValue = new Date(Date.parse(value));
      if (isNaN(dateValue.getTime())) {
        dateValue = new Date();
      }

      if (this.validateNoFutureValue(dateValue)) {
        this.setState({
          value: dateValue.toISOString()
        });
        this.props.updateDateValue(Date.parse(dateValue));
      } else {
        this.setState({
          value: new Date().toISOString()
        });
        this.refs.notification.addNotification('Pflanzung in der Zukunft!', 'Bitte keine zukünftigen Pflanzungen eintragen!', 'error');
      }
    } else {
      this.setState({
        value: value
      });
      this.props.updateDateValue(Date.parse(value));
    }
  }

  resetDate() {
    this.updateValue(new Date().toISOString());
  }

  validateNoFutureValue(value) {
    var dateNow = new Date();
    if (value.getFullYear() <= dateNow.getFullYear() && value.getMonth() <= dateNow.getMonth() && value.getDate() <= dateNow.getDate()) {
      return true;
    } else {
      return false;
    }
  }

  render() {

    return (
      <div className="dateField">
        <DatePicker value={this.state.value} onChange={this.updateValue.bind(this)} onClear={this.resetDate.bind(this)} dateFormat="DD.MM.YYYY" calendarPlacement="right"/>
        <Notification ref="notification"/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
