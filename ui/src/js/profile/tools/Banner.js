import React, {Component} from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router';
import Boostrap from 'bootstrap';
import axios from 'axios';

import Notification from '../../common/components/Notification';
import IconButton from '../../common/components/IconButton';
import RadioButton from '../../common/components/RadioButton';
import LeftRightSwitch from '../../common/components/LeftRightSwitch';
import ButtonBar from './ButtonBar';

export default class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'white',
      format: 'high',
      htmlCode: '',
      width: 100,
      height: 100
    };
  }

  componentDidMount(){
    this.generateHtmlCode();
  }

  updateBannerHeight(event) {
    this.state.height = event.target.value;
    this.forceUpdate();
    this.generateHtmlCode();
  }

  updateBannerWidth(event) {
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
    if (this.state.format == 'high') {
      this.setState({width: 100, height: 100});
    } else {
      this.setState({width: 100, height: 100});
    }
  }

  generateHtmlCode() {
    var that = this;
    axios.get('http://localhost:8081/banner/code?type=' + this.state.type + '&width=' + this.state.width + '&height=' + this.state.height).then(function(response) {
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
    var banner1;
    var banner2;
    var banner3;
    var banner4;
    var bannerImages;

    if (this.state.format == 'high') {
      banner1 = 'http://localhost:8081/banner?type=' + this.state.type + '&width=100&height=100';
      banner2 = 'http://localhost:8081/banner?type=' + this.state.type + '&width=100&height=200';
      banner3 = 'http://localhost:8081/banner?type=' + this.state.type + '&width=100&height=300';
      banner4 = 'http://localhost:8081/banner?type=' + this.state.type + '&width=100&height=400';
      bannerImages = <div className="bannerImages-high">
        <div className="image">
          <img src={banner1}/><br/>
          <RadioButton id="radio-100" value="100" checked={this.state.height == 100} onChange={this.updateBannerHeight.bind(this)} text="&nbsp;100&nbsp;x&nbsp;100&nbsp;px"/>
        </div>
        <div className="image">
          <img src={banner2}/><br/>
          <RadioButton id="radio-200" value="200" checked={this.state.height == 200} onChange={this.updateBannerHeight.bind(this)} text="&nbsp;100&nbsp;x&nbsp;200&nbsp;px"/>
        </div>
        <div className="image">
          <img src={banner3}/><br/>
          <RadioButton id="radio-300" value="300" checked={this.state.height == 300} onChange={this.updateBannerHeight.bind(this)} text="&nbsp;100&nbsp;x&nbsp;300&nbsp;px"/>
        </div>
        <div className="image">
          <img src={banner4}/><br/>
          <RadioButton id="radio-400" value="400" checked={this.state.height == 400} onChange={this.updateBannerHeight.bind(this)} text="&nbsp;100&nbsp;x&nbsp;400&nbsp;px"/>
        </div>
      </div>;
    } else {
      banner1 = 'http://localhost:8081/banner?type=' + this.state.type + '&width=100&height=100';
      banner2 = 'http://localhost:8081/banner?type=' + this.state.type + '&width=200&height=100';
      banner3 = 'http://localhost:8081/banner?type=' + this.state.type + '&width=300&height=100';
      banner4 = 'http://localhost:8081/banner?type=' + this.state.type + '&width=400&height=100';
      bannerImages = <div className="banner-images-cross">
        <div className="image">
          <RadioButton id="radio-c-100" value="100" checked={this.state.width == 100} onChange={this.updateBannerWidth.bind(this)} text="&nbsp;100&nbsp;x&nbsp;100&nbsp;px"/>
          <img src={banner1}/><br/>
        </div>
        <div className="image">
          <RadioButton id="radio-c-200" value="200" checked={this.state.width == 200} onChange={this.updateBannerWidth.bind(this)} text="&nbsp;200&nbsp;x&nbsp;100&nbsp;px"/>
          <img src={banner2}/><br/>
        </div>
        <div className="image">
          <RadioButton id="radio-c-300" value="300" checked={this.state.width == 300} onChange={this.updateBannerWidth.bind(this)} text="&nbsp;300&nbsp;x&nbsp;100&nbsp;px"/>
          <img src={banner3}/><br/>
        </div>
        <div className="image">
          <RadioButton id="radio-c-400" value="400" checked={this.state.width == 400} onChange={this.updateBannerWidth.bind(this)} text="&nbsp;400&nbsp;x&nbsp;100&nbsp;px"/>
          <img src={banner4}/><br/>
        </div>
      </div>;
    }

    return (
      <div className="col-md-12">
        <h1>Tools&nbsp;/&nbsp;Banner</h1>
        <div className="content">
          <div className="banner">
            {bannerImages}
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
        <Notification ref="notification"/>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
