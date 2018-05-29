import React, {Component} from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router';
import Boostrap from 'bootstrap';

export default class TreesFound extends Component {

  constructor(props) {
    super(props);
    this.state = {
      treeCount: 0,
      treeWord: ''
    };
  }

  componentDidMount() {
    var treeCount = 0;
    for (var cnt = 0; cnt < this.props.children.length; cnt++) {
      treeCount = treeCount + this.props.children[cnt].props.content.amount;
    }
    if (treeCount > 1) {
      this.setState({treeCount: treeCount, treeWord: 'Bäumen'});
    } else {
      this.setState({treeCount: treeCount, treeWord: 'Baum'});
    }
  }

  render() {
    return (
      <div className="col-md-12">
        <div className="align-center">
          <div className="foundTreesHead">
            <h1>Zertifikat&nbsp;#{this.props.certificateId}</h1>
            von:&nbsp;<Link to={'/user/' + this.props.certificate.creator.name}>
              {this.props.certificate.creator.name}
            </Link><br/>
            Über die Pflanzung von&nbsp;<span className="bold">{this.state.treeCount}</span>&nbsp;{this.state.treeWord} 
          </div>
          <div className="text">
            {this.props.certificate.text}
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
