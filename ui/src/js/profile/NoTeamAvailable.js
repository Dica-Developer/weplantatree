import axios from 'axios';
import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

import Boostrap from 'bootstrap';

import IconButton from '../common/components/IconButton';

export default class NoTeamAvailable extends Component {
  constructor() {
    super();
  }

  goToCreateTeam(){
    this.props.openCreateTeamPart();
  }

  render() {
    return (
      <div>
        <h1>Du bist noch keinem Team beigetreten! Hast du keine Freunde!?</h1>
        <p>(Hier wäre noch eine Beschreibung gut, was da wirklich hin soll)</p>
        <div className="row align-center bottomButton">
          <IconButton text={counterpart.translate('TEAM_CREATE')} glyphIcon="glyphicon glyphicon-plus" onClick={this.goToCreateTeam.bind(this)}/>
        </div>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
