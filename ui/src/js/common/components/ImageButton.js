import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';

require('./imageButton.less');

export default class ImageButton extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div className="imageButton">
        <a role="button" onClick={this.props.onClick.bind(this)}>
          <img src={this.props.imagePath} alt={this.props.imageAlt} width={this.props.imageWidth} height={this.props.imageHeight}/>
          <p>
            {this.props.text.split('<br/>').map(function(item, i) {
              return (
                <span key={i}>
                {item}
                <br/>
                </span>
              );}
            )}
            </p>
        </a>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
