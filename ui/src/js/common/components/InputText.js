import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';

export default class InputText extends Component {

  constructor() {
    super();
  }

  updateValue(event) {
    this.props.updateValue(this.props.toUpdate, event.target.value);
  }

  render() {
    return (
      <div>
        <input className={this.props.cssclass} placeholder={this.props.placeholderText} type={this.props.type ? this.props.type : 'text'} onBlur={this.updateValue.bind(this)} disabled={this.props.disabled}/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
