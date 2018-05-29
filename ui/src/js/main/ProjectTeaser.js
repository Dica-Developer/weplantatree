import axios from 'axios';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import {browserHistory} from 'react-router';

import Boostrap from 'bootstrap';

import {getTextForSelectedLanguage, getShortText} from '../common/language/LanguageHelper';

export default class ProjectTeaser extends Component {
  constructor(props) {
    super(props);
  }

  linkTo(url) {
    browserHistory.push(url);
  }

  render() {
    let position = [this.props.content.latitude, this.props.content.longitude];
    return (
      <div>
        <Map center={position} zoom={13} scrollWheelZoom={false} dragging={false}>
          <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
          <Marker position={position}>
            <Popup>
              <span>{this.props.content.projectName}</span>
            </Popup>
          </Marker>
        </Map>
        <a role="button" onClick={() => {
          this.linkTo('/projects/' + this.props.content.projectName);
        }}>
          <h1>
            {this.props.content.projectName}
          </h1>
          <div className="description">
            <p dangerouslySetInnerHTML={{
              __html: getShortText(getTextForSelectedLanguage(this.props.content.description), 300)
            }}/>
          </div>
        </a>
      </div>
    );
  }
}

ProjectTeaser.defaultProps = {
  content: {
    latitude: 0,
    longitude: 0,
    projectName: '',
    description: ''
  }
};

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
