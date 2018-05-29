import React, {Component} from 'react';
import {render} from 'react-dom';
import Accounting from 'accounting';
import Boostrap from 'bootstrap';

import IconButton from '../common/components/IconButton';

require('./plantBagItem.less');

export default class PlantBagItem extends Component {

  constructor() {
    super();
    this.state = {
      decreaseInterval: null,
      increaseInterval: null,
      descreaseDown: false,
      increaseDown: false,
      intervalDuration: 0,
      scaleResult: false
    };
    this.scalingDone = this.scalingDone.bind(this);
  }

  componentWillUnmount() {
    const elm = this.refs.result;
    elm.removeEventListener('animationend', this.scalingDone);
  }
  scalingDone() {
    this.setState({scaleResult: false});
  }

  componentDidMount(){
    const elm = this.refs.result;
    elm.addEventListener('animationend', this.scalingDone);
  }

  startDecreasing() {
    this.props.decreasePlantBagItem();
    var that = this;
    this.state.descreaseDown = true;
    setTimeout(function() {
      that.state.decreaseInterval = setInterval(function() {
        if (that.state.descreaseDown && that.props.plantBagitem.amount != 1) {
          that.props.decreasePlantBagItem();
          that.setState({scaleResult: true});
          that.forceUpdate();
        } else {
          clearInterval(that.state.decreaseInterval);
        }
      }, 100);
    }, 750);
    this.setState({scaleResult: true});
  }

  stopDecreasing() {
    this.setState({descreaseDown: false});
  }

  startIncreasing() {
    this.props.increasePlantBagItem();
    var that = this;
    this.state.increaseDown = true;
    setTimeout(function() {
      that.state.increaseInterval = setInterval(function() {
        if (that.state.increaseDown) {
          that.props.increasePlantBagItem();
          that.setState({scaleResult: true});
          that.forceUpdate();
        } else {
          clearInterval(that.state.increaseInterval);
        }
      }, 100);
    }, 750);
    this.setState({scaleResult: true});
  }

  stopIncreasing() {
    this.setState({increaseDown: false});
  }

  render() {
    let imageUrl = 'http://localhost:8081/treeType/image/' + this.props.plantBagitem.imageFile + '/60/60';
    return (
      <div className="plantBagItem">
        <div className="image">
          <img src={imageUrl}/>
        </div>
        <div className="treeTypeInfo">
          <p>
            <span className="bold uppercase">{this.props.plantItemName}</span><br/>Stk.&nbsp;<span className="bold">{Accounting.formatNumber(this.props.plantBagitem.price / 100, 2, '.', ',')}&nbsp;€</span>
          </p>
        </div>
        <div className="customizer">
          <a role="button" onMouseDown={this.startDecreasing.bind(this)} onMouseUp={this.stopDecreasing.bind(this)}>
            <span className={('glyphicon glyphicon-minus')} aria-hidden="true"></span>
          </a>
          <span className="bold">{this.props.plantBagitem.amount}</span>
          <a role="button" onMouseDown={this.startIncreasing.bind(this)} onMouseUp={this.stopIncreasing.bind(this)}>
            <span className={('glyphicon glyphicon-plus')} aria-hidden="true"></span>
          </a>
        </div>
        <div className="result-arrow">
        </div>
        <div ref="result" className={(this.state.scaleResult
          ? 'scaleResult'
          : ' ')  + ' result'}>
          <p className="bold">{Accounting.formatNumber(this.props.plantBagitem.amount * this.props.plantBagitem.price / 100, 2, '.', ',')}&nbsp;€</p>
          <IconButton glyphIcon="glyphicon-trash" onClick={this.props.removePlantBagItem.bind(this)}/>
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
