import he from 'he';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { createProfileImageUrl } from '../common/ImageHelper';

class Member extends Component {
  constructor(props) {
    super(props);
  }

  linkToProfile() {
    browserHistory.push('/user/' + encodeURIComponent(this.props.member.name));
  }

  render() {
    let imageUrl = createProfileImageUrl(this.props.member.imageName, 80, 80);
    return (
      <div className="member align-center">
        <a role="button" onClick={this.linkToProfile.bind(this)}>
          <div className="image">
            <img src={imageUrl} width="80" height="80" />
          </div>
          <div className="name">{he.decode(this.props.member.name)}</div>
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
          return <Member member={member} key={i} />;
        })}
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
