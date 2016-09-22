import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';

import IconButton from '../../common/components/IconButton';

export default class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content,
      contentTemp: this.props.content,
      edit: false
    };

  }

  componentDidUpdate() {
    this.refs.content.focus();
  }

  editContent() {
    this.setState({edit: true});
  }

  editUser() {
    this.props.editUser(this.props.toEdit, this.state.contentTemp);
  }

  saveChanges(){
    this.setState({content: this.state.contentTemp, contentTemp: this.state.contentTemp, edit: false});
  }

  undoChanges() {
    this.setState({contentTemp: this.state.content, edit: false});
  }

  updateContent(e) {
    this.setState({contentTemp: e.target.value});
  }

  render() {
    var link;
    if (this.state.edit) {
      link = <div><IconButton text="SPEICHERN" glyphIcon="glyphicon-floppy-save" onClick={this.editUser.bind(this)}/><IconButton text="VERWERFEN" glyphIcon="glyphicon-trash" onClick={this.undoChanges.bind(this)}/></div>;
    } else {
      link = <IconButton text="BEARBEITEN" glyphIcon="glyphicon-cog" onClick={this.editContent.bind(this)}/>;
    }

    return (
      <div className="editItem">
        <div className="left">
          <span className="bold">{this.props.text}:&nbsp;</span><input type="text" value={this.state.contentTemp} onChange={this.updateContent.bind(this)} ref="content" disabled={!this.state.edit}/></div>
        <div className="right">
          {link}
        </div>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
