import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';

require('./leftRightSwitch.less');

export default class LeftRightSwitch extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div className="leftRightSwitch">
        <div className={'buttonDiv ' + (this.props.chosenValue == this.props.leftValue
          ? 'chosen'
          : '')}>
          <a role="button" onClick={() => {
            this.props.onClick(this.props.leftValue);
          }}>
            {this.props.leftText}
          </a>
        </div>
        <div className={'buttonDiv ' + (this.props.chosenValue == this.props.rightValue
          ? 'chosen'
          : '')}>
          <a role="button" onClick={() => {
            this.props.onClick(this.props.rightValue);
          }}>
            {this.props.rightText}
          </a>
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
