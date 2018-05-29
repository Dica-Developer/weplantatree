import React, {
  Component
} from 'react';
import axios from 'axios';
import {
  browserHistory
} from 'react-router';
import Accounting from 'accounting';

import Notification from '../components/Notification';
import IconButton from '../components/IconButton';

export default class LoginMenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: '',
      loggedIn: (localStorage.getItem('jwt') != null && localStorage.getItem('jwt') != ''),
      userDetails: {
        imageFileName: 'default',
        co2Data: {}
      }
    };
  }

  componentDidMount() {
    if (localStorage.getItem('username') && localStorage.getItem('username') != '') {
      this.loadUserDetails();
    }
  }

  updateName(e) {
    this.setState({
      name: e.target.value
    });
  }

  updatePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  showErrorMessageAndClearInputFields() {
    this.setState({
      name: '',
      password: ''
    });
  }

  handleLogin(token) {
    var that = this;
    localStorage.setItem('jwt', token);
    localStorage.setItem('username', this.state.name);

    axios.get('http://localhost:8081/user/language?userName=' + this.state.name).then(function(response) {
      var result = response.data;
      if (localStorage.getItem('language') != result) {
        that.props.updateLanguage(result);
      }
      that.isAdmin();
    }).catch(function(response) {
      if (response instanceof Error) {
        console.error('Error', response.message);
      } else {
        console.error(response.data);
        console.error(response.status);
        console.error(response.headers);
        console.error(response.config);
      }
    });

  }

  isAdmin() {
    var that = this;
    var config = {
      headers: {
        'X-AUTH-TOKEN': localStorage.getItem('jwt')
      }
    };
    axios.get('http://localhost:8081/isAdmin', config).then(function(response) {
      var result = response.data;
      localStorage.setItem('isAdmin', result);
      that.setState({
        loggedIn: true,
        name: '',
        password: ''
      });
      that.loadUserDetails();
    }).catch(function(response) {
      if (response instanceof Error) {
        console.error('Error', response.message);
      } else {
        console.error(response.data);
        console.error(response.status);
        console.error(response.headers);
        console.error(response.config);
      }
    });

  }

  loadUserDetails() {
    var that = this;
    var config = {
      headers: {
        'X-AUTH-TOKEN': localStorage.getItem('jwt')
      }
    };
    axios.get('http://localhost:8081/user?userName=' + localStorage.getItem('username'), config).then(function(response) {
      var result = response.data;
      that.setState({
        userDetails: result
      });
      localStorage.setItem('userDetails', JSON.stringify(result));
      that.props.updateNavbar();
    }).catch(function(response) {
      if (response instanceof Error) {
        console.error('Error', response.message);
      } else {
        console.error(response.data);
        console.error(response.status);
        console.error(response.headers);
        console.error(response.config);
      }
    });
  }

  login() {
    var that = this;
    axios({
      method: 'post',
      url: 'http://localhost:8081/api/login',
      headers: {
        'Content-Type': 'text/plain'
      },
      data: {
        name: this.state.name,
        password: this.state.password
      }
    }).then(function(response) {
      that.handleLogin(response.headers['x-auth-token']);
    }.bind(this)).catch(function(response) {
      that.setState({
        name: '',
        password: ''
      });
      that.refs.notification.addNotificationAtDifferentPos('Fehler!', 'Die Kombination aus Name und Passwort stimmt nicht überein! Bitte versuche Sie es noch einmal.', 'error', 'tr');
    });
  }

  logout() {
    localStorage.setItem('jwt', '');
    localStorage.setItem('username', '');
    localStorage.setItem('isAdmin', false);
    localStorage.setItem('userDetails', '');
    this.setState({
      name: '',
      password: '',
      loggedIn: false
    });
    this.props.updateNavbar();
  }

  linkTo(url) {
    browserHistory.push(url);
  }

  render() {
    var content;
    if (localStorage.getItem('username') && localStorage.getItem('username') != '') {
      let imageUrl = 'http://localhost:8081/user/image/' + this.state.userDetails.imageFileName + '/50/50';

      content = <div className="login-user-details">
        <div>
          <img src={imageUrl} alt="profile"/>
        </div>
        <div>
          <span className="glyphicon glyphicon-user" aria-hidden="true"></span>
          <label>{localStorage.getItem('username')}</label>
          <br/>
          <span className="glyphicon glyphicon-tree-deciduous" aria-hidden="true"></span>
          <label>{this.state.userDetails.co2Data.treesCount}</label>
          <br/>
          <span className="glyphicon glyphicon glyphicon-cloud" aria-hidden="true"></span>
          <label>{Accounting.formatNumber(this.state.userDetails.co2Data.co2, 0, '.', ',')} tCO<sub>2</sub></label>
        </div>
        <div className="logout-div">
          <a onClick={this.logout.bind(this)}>logout</a>
        </div>
      </div>;
    } else {
      content = <div className="login">
        <input type="text" placeholder="Benutzername" value={this.state.name} onChange={this.updateName.bind(this)}/>
        <input type="password" placeholder="Passwort" value={this.state.password} onChange={this.updatePassword.bind(this)}/>
        <div className="login-interact">
          <a role="button" onClick={() => {
            this.linkTo('/forgotPassword');
          }}>Passwort vergessen?</a>
        </div>
        <div className="buttonDiv">
          <IconButton text="LOGIN" glyphIcon="glyphicon-log-in" onClick={this.login.bind(this)}/>
        </div>
        <div className="login-interact">
          <a role="button" onClick={() => {
            this.linkTo('/registration');
          }}>Registrieren</a>
        </div>
      </div>;
    }

    return (
      <div className="login-menu-item">
        {content}
        <Notification ref="notification"/>
      </div>
    );
  }
}
