import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';

import Tools from './tools/Tools';

export default class ToolsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {
      },
      pageCount: 0
    };
  }

  render() {
    var that = this;
    var toolsPart;
    var page = this.state.pageCount;

    toolsPart = <Tools/>;

    return (
      <div className="container paddingTopBottom15">
        {toolsPart}
      </div>
    );
  }
}
