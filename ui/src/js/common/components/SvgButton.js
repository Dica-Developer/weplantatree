import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';

var svgParams = require('./svgParams.js');

require('./svgButton.less');

export default class svgButton extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let buttonType = this.props.buttonType;
    let svgButton = [];
    svgButton.push('<svg width="' + svgParams[buttonType].width + '" height="' + svgParams[buttonType].height + '" viewBox="' + svgParams[buttonType].viewBox + '">');
    svgButton.push('<title>' + svgParams[buttonType].title + '</title>');
    for(let transformFunction of svgParams[buttonType].transform){
      svgButton.push('<g transform="' + transformFunction + '">');
    }
    svgButton.push('<path d="' + svgParams[buttonType].path + '"/>');
    for(let transformValue of svgParams[buttonType].transform){
      svgButton.push('</g>');
    }
    svgButton.push('</svg>');

    return (
      <div className="svgButton">
        <a role="button" onClick={this.props.onClick.bind(this)}>
          <div dangerouslySetInnerHTML={{ __html: svgButton }} />
          <p>
            {this.props.text.split('<br/>').map(function(item, i) {
              return (
                <span key={i}>
                  {item}
                  <br/>
                </span>
              );
            })}
          </p>
        </a>
      </div>
    );
  }
}
