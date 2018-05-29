import axios from 'axios';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {browserHistory} from 'react-router';
import moment from 'moment';
import Accounting from 'accounting';

import {htmlDecode} from '../common/language/HtmlHelper';
import Boostrap from 'bootstrap';

class Member extends Component {
  constructor(props) {
    super(props);
  }

  linkToProfile(){
    browserHistory.push('/user/' + this.props.member.name);
  }

  render() {
    let imageUrl = 'http://localhost:8081/user/image/' + this.props.member.imageName + '/80/80';
    return (
      <div className="member align-center">
        <a role="button" onClick={this.linkToProfile.bind(this)}>
          <div className="image">
            <img src={imageUrl}/>
          </div>
          <div className="name">
            {htmlDecode(this.props.member.name)}
          </div>
        </a>
      </div>
    );
  }
}

export default class TeamMember extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="teamMember">
        <h1>Mitglieder</h1>
        {this.props.teamMember.content.map(function(member, i) {
          return (<Member member={member} key={i}/>);
        })}
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
