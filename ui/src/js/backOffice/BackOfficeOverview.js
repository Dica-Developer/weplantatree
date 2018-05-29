import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import {
  browserHistory
} from 'react-router';

require('./backOfficeOverview.less');

class BackofficeLink extends Component {
  constructor(props) {
    super(props);
  }

  linkTo(url) {
    browserHistory.push(url);
  }

  render() {
    return (
      <div className="col-md-4 ">
      <a role="button"  onClick={() => {
        this.linkTo(this.props.url);
      }} >
      <div className="backoffice-link">
        <span className={'glyphicon ' + this.props.glyphIcon} aria-hidden="true"></span>
        <br/>
        <span>
          {this.props.text}
        </span>
      </div>
      </a>
      </div>
    );
  }
}

export default class BackOfficeOverview extends Component {

  constructor() {
    super();
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="container paddingTopBottom15 backOfficeOverview">
          <div className="row ">
            <div className="col-md-12">
              <h1>Backoffice</h1>
            </div>
          </div>
          <div className="row ">
            <BackofficeLink text="Content" url="/article-manager" glyphIcon="glyphicon-text-size"/>
            <BackofficeLink text="Carts" url="/cart-manager" glyphIcon="glyphicon-shopping-cart"/>
            <BackofficeLink text="Projekte" url="/project-manager" glyphIcon="glyphicon-tags"/>
            <BackofficeLink text="User" url="/user-manager" glyphIcon="glyphicon-user"/>
            <BackofficeLink text="Baumarten" url="/treeType-manager" glyphIcon="glyphicon-leaf"/>
            <BackofficeLink text="Pflanzen" url="/plant-manager" glyphIcon="glyphicon-tree-deciduous"/>
            <BackofficeLink text="Events" url="/event-manager" glyphIcon="glyphicon-list-alt"/>
            <BackofficeLink text="Slider" url="/slider-image-manager" glyphIcon="glyphicon-picture"/>
          </div>
        </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
