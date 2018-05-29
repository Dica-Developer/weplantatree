import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import Accounting from 'accounting';
import IconButton from '../common/components/IconButton';

require('./plantBagProject.less');

export default class PlantBagProject extends Component {

  constructor() {
    super();
    this.state = {
      showItems: true
    };
  }

  showItems(value) {
    this.setState({
      showItems: value
    });
  }

  render() {
    var that = this;
    var items;
    var button;
    if (this.state.showItems) {
      button = <IconButton glyphIcon="glyphicon glyphicon-chevron-down" onClick={()=>{this.showItems(false);}}/>;
      items = this.props.children;
    } else {
      button = <IconButton glyphIcon="glyphicon-chevron-right" onClick={()=>{this.showItems(true);}}/>;
      items= '';
    }
    return (
      <div className="plantBagProject">
        {button}<h3>{this.props.projectName}</h3>
        <div className={this.state.showItems ? 'sliding-out' : 'sliding-in'}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
