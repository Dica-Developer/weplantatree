import axios from 'axios';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router';
import moment from 'moment';
import Accounting from 'accounting';
import Boostrap from 'bootstrap';

export default class UserDetails extends Component {
  constructor(props) {
    super(props);
  }

  showEditUser(){
    this.props.showEditUser();
    console.log('show edit user');
  }

  render() {
    let imageUrl;
    if (this.props.user.userName) {
      imageUrl = 'http://localhost:8081/user/image/' + this.props.user.imageFileName + '/150/150'
    }

    var editLink;
    if (this.props.user.editAllowed) {
      editLink = <a role="button" onClick={this.showEditUser.bind(this)} className="editLink">
        <div>
          <img src="/assets/images/edit.jpg" alt="editieren" width="45" height="45"/>
          <span className="no-link-deco">BEARBEITEN</span>
        </div>
      </a>;
    }

    return (
      <div>
        <h2>Profil</h2>
        <div className="imageDiv">
          <img src={imageUrl} alt="profile"/>
        </div>
        <p className="userName">{this.props.user.userName}</p>
        <div className="stats">
          <table>
            <tbody>
              <tr>
                <td>
                  <span className="bold">Rang:&nbsp;</span>{this.props.user.rank}
                </td>
                <td>
                  <span className="bold">Mitglied seit:&nbsp;</span>{moment(this.props.user.regDate).format("DD.MM.YYYY")}</td>
              </tr>
              <tr>
                <td>
                  <span className="bold">B&auml;ume gepflanzt:&nbsp;</span>{Accounting.formatNumber(this.props.user.co2Data.treesCount, 0, ".", ",")}</td>
                <td>
                  <span className="bold">letzter Besuch:&nbsp;</span>{moment(this.props.user.lastVisit).format("DD.MM.YYYY")}</td>
              </tr>
              <tr>
                <td>
                  <span className="bold">CO<sub>2</sub>&nbsp;gebunden:&nbsp;</span>{Accounting.formatNumber(this.props.user.co2Data.co2, 3, ".", ",")}&nbsp;t</td>
                <td>
                  <span className="bold">Typ:&nbsp;</span>{this.props.user.organizationType}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {editLink}
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
