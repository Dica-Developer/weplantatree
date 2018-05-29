import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Notification from '../common/components/Notification';
import axios from 'axios';
import Boostrap from 'bootstrap';

import TreeItem from './TreeItem';
import FindTrees from './FindTrees';
import TreesFound from './TreesFound';

require('./findTreePage.less');

export default class FindTreePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      treesFound: false,
      certificateId: '',
      trees: [],
      certificate: {}
    };
  }

  findCertificate(certificateId) {
    var that = this;
    this.setState({
      certificateId: certificateId
    });
    axios.get('http://localhost:8081/certificate/search/' + certificateId).then(function(response) {
      var result = response.data;
      that.setState({
        trees: result
      });
      axios.get('http://localhost:8081/certificate/summary/' + certificateId).then(function(response) {
        var result = response.data;
        that.setState({
          certificate: result,
          treesFound: true
        });
      });
    }).catch(function(response) {
      that.refs.notification.addNotification('Zertifikat nicht vorhanden!', 'Es gibt kein Zertifikat mit dieser Nummer.', 'error');
    });
  }

  render() {
    var content;
    if (this.state.treesFound) {
      content = <TreesFound certificateId={this.state.certificateId} certificate={this.state.certificate}>
                {this.state.trees.map(function(tree, i) {
                  let imageUrl = 'http://localhost:8081/treeType/image/' + tree.treeType.imageFile + '/60/60';
                  return (<TreeItem imageUrl={imageUrl} content={tree} key={i}/>);
                })}
              </TreesFound>;
    } else {
      content = <FindTrees findCertificate={this.findCertificate.bind(this)}/>;
    }
    return (
      <div className="container paddingTopBottom15">
        <div className="row findTree">
          {content}
        </div>
        <Notification ref="notification"/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
