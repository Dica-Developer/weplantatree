import React, {Component} from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router';
import Boostrap from 'bootstrap';
import axios from 'axios';
import moment from 'moment';
import Accounting from 'accounting';

import RadioButton from '../../common/components/RadioButton';
import IconButton from '../../common/components/IconButton';
import LeftRightSwitch from '../../common/components/LeftRightSwitch';
import ButtonBar from './ButtonBar';

export default class Widgets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'white',
      format: 'high',
      htmlCode: '',
      width: 100,
      height: 100,
      userName: localStorage.getItem('username')
    };
  }

  componentDidMount(){
    this.generateHtmlCode();
  }

  updateWidgetHeight(event) {
    this.state.height = event.target.value;
    this.forceUpdate();
    this.generateHtmlCode();
  }

  updateWidgetWidth(event) {
    this.state.width = event.target.value;
    this.forceUpdate();
    this.generateHtmlCode();
  }

  updateType(value) {
    this.state.type = value;
    this.forceUpdate();
    this.generateHtmlCode();
  }

  updateFormat(value) {
    this.setState({format: value});
    if (value == 'high') {
      this.setState({width: 100, height: 100});
    } else {
      this.setState({width: 100, height: 100});
    }

  }

  generateHtmlCode() {
    var that = this;
    axios.get('http://localhost:8081/widget/code?userName=' + this.state.userName + '&type=' + this.state.type + '&width=' + this.state.width + '&height=' + this.state.height).then(function(response) {
      var result = response.data;
      that.setState({htmlCode: result});
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

  render() {
    var widget1;
    var widget2;
    var widget3;
    var widget4;
    var widgets;

    if (this.state.format == 'high') {
      widget1 = 'http://localhost:8081/widget?userName=' + this.state.userName + '&type=' + this.state.type + '&width=100&height=100';
      widget2 = 'http://localhost:8081/widget?userName=' + this.state.userName + '&type=' + this.state.type + '&width=100&height=200';
      widget3 = 'http://localhost:8081/widget?userName=' + this.state.userName + '&type=' + this.state.type + '&width=100&height=300';
      widget4 = 'http://localhost:8081/widget?userName=' + this.state.userName + '&type=' + this.state.type + '&width=100&height=400';
      widgets = <div className="widgets-images-high">
        <div className="image">
          <img src={widget1}/><br/>
          <RadioButton id="radio-100" value="100" checked={this.state.height == 100} onChange={this.updateWidgetHeight.bind(this)} text="&nbsp;100&nbsp;x&nbsp;100&nbsp;px"/>
        </div>
        <div className="image">
          <img src={widget2}/><br/>
          <RadioButton id="radio-200" value="200" checked={this.state.height == 200} onChange={this.updateWidgetHeight.bind(this)} text="&nbsp;100&nbsp;x&nbsp;200&nbsp;px"/>
        </div>
        <div className="image">
          <img src={widget3}/><br/>
          <RadioButton id="radio-300" value="300" checked={this.state.height == 300} onChange={this.updateWidgetHeight.bind(this)} text="&nbsp;100&nbsp;x&nbsp;300&nbsp;px"/>
        </div>
        <div className="image">
          <img src={widget4}/><br/>
          <RadioButton id="radio-400" value="400" checked={this.state.height == 400} onChange={this.updateWidgetHeight.bind(this)} text="&nbsp;100&nbsp;x&nbsp;400&nbsp;px"/>
        </div>
      </div>;
    } else {
      widget1 = 'http://localhost:8081/widget?userName=' + this.state.userName + '&type=' + this.state.type + '&width=100&height=100';
      widget2 = 'http://localhost:8081/widget?userName=' + this.state.userName + '&type=' + this.state.type + '&width=200&height=100';
      widget3 = 'http://localhost:8081/widget?userName=' + this.state.userName + '&type=' + this.state.type + '&width=300&height=100';
      widget4 = 'http://localhost:8081/widget?userName=' + this.state.userName + '&type=' + this.state.type + '&width=400&height=100';
      widgets = <div className="widgets-images-cross">
        <div className="image">
          <RadioButton id="radio-c-100" value="100" checked={this.state.width == 100} onChange={this.updateWidgetWidth.bind(this)} text="&nbsp;100&nbsp;x&nbsp;100&nbsp;px"/>
          <img src={widget1}/><br/>
        </div>
        <div className="image">
          <RadioButton id="radio-c-200" value="200" checked={this.state.width == 200} onChange={this.updateWidgetWidth.bind(this)} text="&nbsp;200&nbsp;x&nbsp;100&nbsp;px"/>
          <img src={widget2}/><br/>
        </div>
        <div className="image">
          <RadioButton id="radio-c-300" value="300" checked={this.state.width == 300} onChange={this.updateWidgetWidth.bind(this)} text="&nbsp;300&nbsp;x&nbsp;100&nbsp;px"/>
          <img src={widget3}/><br/>
        </div>
        <div className="image">
          <RadioButton id="radio-c-400" value="400" checked={this.state.width == 400} onChange={this.updateWidgetWidth.bind(this)} text="&nbsp;400&nbsp;x&nbsp;100&nbsp;px"/>
          <img src={widget4}/><br/>
        </div>
      </div>;
    }
    return (
      <div className="col-md-12">
        <h1>Tools&nbsp;/&nbsp;Widgets</h1>
        <div className="content">
          <div className="widgets">
            {widgets}
            <div className="code-and-options">
              <div className="options">
                <p>weitere Optionen:</p>
                <LeftRightSwitch leftText="weiß" rightText="grün" leftValue="white" rightValue="green" chosenValue={this.state.type} onClick={this.updateType.bind(this)}/><br/>
                <LeftRightSwitch leftText="hoch" rightText="quer" leftValue="high" rightValue="cross" chosenValue={this.state.format} onClick={this.updateFormat.bind(this)}/>
              </div>
              <div className="code">
                <p>Einbettungs-Code:</p>
                <textarea rows="4" cols="50" maxLength="250" value={this.state.htmlCode}/>
              </div>
            </div>
          </div>
        </div>
        <ButtonBar switchTo={this.props.switchTo.bind(this)} chosen={this.props.view}/>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
