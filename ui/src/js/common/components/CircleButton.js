import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';

require('./circleButton.less');

export default class CircleButton extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div className={"circleButton " + this.props.className}>
        <a role="button" onClick={this.props.onClick.bind(this)}>
          <span className={('glyphicon ' + this.props.glyphIcon) + ' circle'} aria-hidden="true"></span>
          <span className="label">
            {this.props.text}
          </span>
        </a>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
