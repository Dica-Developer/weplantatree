import counterpart from 'counterpart';
import React, { Component } from 'react';
import IconButton from '../../common/components/IconButton';

export default class EditDropdownItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      contentTemp: '',
      edit: false,
      selectedIndex: 0
    };
  }

  componentDidMount() {
    for (var i = 0; i < this.refs.select.options.length; i++) {
      if (this.refs.select.options[i].value === this.props.content) {
        this.state.selectedIndex = i;
        this.state.content = this.refs.select.options[i].value;
        this.state.contentTemp = this.refs.select.options[i].value;
        this.refs.select.options[i].selected = true;
        break;
      }
    }
    this.forceUpdate();
  }

  findSelectedIndex() {
    for (var i = 0; i < this.refs.select.options.length; i++) {
      if (this.refs.select.options[i].value === this.state.content) {
        this.state.selectedIndex = i;
        this.refs.select.options[i].selected = true;
        break;
      }
    }
    this.forceUpdate();
  }

  editContent() {
    this.setState({ edit: true });
  }

  editUser() {
    this.props.editUser(this.props.toEdit, this.state.contentTemp);
  }

  saveChanges() {
    this.state.content = this.state.contentTemp;
    this.state.contentTemp = this.state.contentTemp;
    this.state.edit = false;
    this.forceUpdate();
    this.findSelectedIndex();
  }

  undoChanges(content) {
    this.state.contentTemp = this.state.content;
    this.state.edit = false;
    this.forceUpdate();
    this.refs.select.options[this.state.selectedIndex].selected = true;
  }

  updateContent(e) {
    this.setState({ contentTemp: e.target.value });
  }

  render() {
    var link;
    if (this.state.edit) {
      link = (
        <div>
          <IconButton text={counterpart.translate('SAVE')} glyphIcon="glyphicon-floppy-save" onClick={this.editUser.bind(this)} />
          <IconButton text={counterpart.translate('DISCARD')} glyphIcon="glyphicon-trash" onClick={this.undoChanges.bind(this)} />
        </div>
      );
    } else {
      link = <IconButton text={counterpart.translate('EDIT')} glyphIcon="glyphicon-cog" onClick={this.editContent.bind(this)} />;
    }

    return (
      <div className="row editItem">
        <div className="col-md-9">
          <span className="bold">{this.props.text}:&nbsp;</span>
          <select disabled={!this.state.edit} onChange={this.updateContent.bind(this)} style={{ width: this.props.width + 'px' }} ref="select" className={this.state.edit ? '' : 'no-display'}>
            {this.props.children}
          </select>
          <input type="text" value={counterpart.translate(this.props.content)} ref="content" disabled={true} className={this.state.edit ? 'no-display' : ''} />
        </div>
        <div className="col-md-3">{link}</div>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
