import axios from 'axios';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';

import Boostrap from 'bootstrap';

export default class ProjectTeaser extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let position = [this.props.content.latitude, this.props.content.longitude];
    return (
      <div className="col-md-4">
        <Map center={position} zoom={13}>
          <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
          <Marker position={position}>
            <Popup>
              <span>{this.props.content.projectName}</span>
            </Popup>
          </Marker>
        </Map>
        <h3>{this.props.content.projectName}</h3>
        <p>{this.props.content.description}</p>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */