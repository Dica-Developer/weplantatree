import React, {Component} from 'react';
import {Link} from 'react-router';

export default class LanguageMenuItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="language-menu-item">
        <a role="button" className={(this.props.language == 'DEUTSCH') ? 'selected' : ''} onClick={()=>{this.props.updateLanguage('DEUTSCH');}}>DE</a>
        <a role="button" className={(this.props.language == 'ENGLISH') ? 'selected' : ''}  onClick={()=>{this.props.updateLanguage('ENGLISH');}}>EN</a>
      </div>
    );
  }
}
