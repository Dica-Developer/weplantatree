import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

import SvgButton from '../components/SvgButton';

export default class ButtonBar extends Component {

  constructor() {
    super();
  }

  linkTo(url) {
    browserHistory.push(url);
  }

  render() {
    return (
      <div className="buttonBar">
        <SvgButton text={counterpart.translate('buttonbar.plant_self')} buttonType="shovel" onClick={() => {
          this.linkTo('/selfPlant');
        }} />
        <br/>
        <SvgButton text={counterpart.translate('buttonbar.plant_online')} buttonType="mouse" onClick={() => {
          this.linkTo('/plant/5');
        }} />
        <br/>
        <SvgButton text={counterpart.translate('buttonbar.tree_service')} buttonType="secateurs" onClick={() => {
          this.linkTo('/treeService');
        }} />
      </div>
    );
  }
}
