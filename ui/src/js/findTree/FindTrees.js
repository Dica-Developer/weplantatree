import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';

import IconButton from '../common/components/IconButton';

export default class FindTrees extends Component {

  constructor(props) {
    super(props);
    this.state = {
      certificateId: ''
    };
  }

  updateCertId(event) {
    this.setState({
      certificateId: event.target.value
    });
  }

  render() {
    return (
      <div className="col-md-12">
        <h1>Pflanzungen finden</h1>
        <div className="certificateWrapper">
            Zertifikat-Nummer: <input type="text" onBlur={this.updateCertId.bind(this)}/>
          <IconButton text="Finden" glyphIcon="glyphicon-search" onClick={()=>{this.props.findCertificate(this.state.certificateId);}}/>
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
