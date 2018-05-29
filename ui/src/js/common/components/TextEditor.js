import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import TinyMCE from 'react-tinymce';

export default class TextEditor extends Component {

  constructor(){
    super();
    this.state = {
      config: {
        plugins: 'link table code',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
        height: 200
      }
    };
  }

  refreshEditor(){
    this.refs['editor']._init(this.state.config, this.props.content);
  }

  render() {
    return (
      <div>
      <TinyMCE ref="editor" content={this.props.content} config={this.state.config}  onChange={this.props.handleContentChange.bind(this)}/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
