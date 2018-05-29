import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import {browserHistory} from 'react-router';
import TinyMCE from 'react-tinymce';

import InputText from '../../common/components/InputText';
import FileChooser from '../../common/components/FileChooser';
import RadioButton from '../../common/components/RadioButton';
import IconButton from '../../common/components/IconButton';
import TextEditor from '../../common/components/TextEditor';
import Notification from '../../common/components/Notification';
import {getConfig} from '../../common/RestHelper';

class Paragraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageFile: null,
      paragraph: this.props.paragraph
    };
  }

  updateValue(toUpdate, value) {
    this.state.paragraph[toUpdate] = value;
    this.forceUpdate();
  }

  handleTextChange(e) {
    var updatedParagraph = this.state.paragraph;
    updatedParagraph.text = e.target.getContent();
    this.setState({paragraph: updatedParagraph});
  }

  updateImage(imageName, file) {
    this.state.paragraph.imageFileName = imageName;
    this.state.imageFile = file;
    this.forceUpdate();
  }

  getParagraph() {
    return this.state.paragraph;
  }

  getImageFile() {
    return this.state.imageFile;
  }

  render() {
    var imgUrl;
    var imgContent;
    if (this.state.paragraph.imageFileName != null && this.state.paragraph.imageFileName != '' && this.state.imageFile == null) {
      imgUrl = 'http://localhost:8082/article/image/' + this.props.articleId + '/' + this.state.paragraph.imageFileName + '/300/300';
      imgContent = <img src={imgUrl}/>;
    } else {
      imgContent = '';
    }
    if (this.state.paragraph.imageDescription == null) {
      this.state.paragraph.imageDescription = '';
    }

    return (
      <div>
        <div className="row content-row">
          <div className="col-md-12">
            <h4>Paragraph {this.props.paragraphNumber}:</h4>
          </div>
        </div>
        <div className="row content-row">
          <div className="col-md-2">
            Titel:
          </div>
          <div className="col-md-10 title">
            <input type="text" value={this.state.paragraph.title} onChange={(event) => {
              this.updateValue('title', event.target.value);
            }}/>
          </div>
        </div>
        <div className="row content-row">
          <div className="col-md-2">
            Inhalt:
          </div>
          <div className="col-md-10">
            <TextEditor content={this.state.paragraph.text} handleContentChange={this.handleTextChange.bind(this)}/>
          </div>
        </div>
        <div className="row image-row">
          <div className="col-md-2">
            Bild:
          </div>
          <div className="col-md-10">
            <FileChooser updateFile={this.updateImage.bind(this)}/> {imgContent}
          </div>
        </div>
        <div className="row image-row">
          <div className="col-md-2">
            Bildunterschrift:
          </div>
          <div className="col-md-10">
            <input type="text" value={this.state.paragraph.imageDescription} onChange={(event) => {
              this.updateValue('imageDescription', event.target.value);
            }}/>
          </div>
        </div>
      </div>
    );
  }
}

export default class ArticleEditor extends Component {

  constructor() {
    super();
    this.state = {
      articleTypes: [],
      imageFile: null,
      article: {
        id: 0,
        title: '',
        articleType: 'HOME',
        intro: '',
        paragraphs: [],
        lang: 'DEUTSCH',
        visible: false,
        imageFileName: '',
        imageDescription: ''
      },
      paragraphCount: 0,
      articleImageChanged: false
    };
  }

  componentDidMount() {
    var that = this;
    axios.get('http://localhost:8082/articleTypes').then(function(response) {
      var result = response.data;
      that.setState({articleTypes: result});
    }).catch(function(response) {
      if (response instanceof Error) {
        console.error('Error', response.message);
      } else {
        console.error(response.data);
        console.error(response.status);
        console.error(response.headers);
        console.error(response.config);
      }
    });

    var restConfig = getConfig();
    axios.get('http://localhost:8082/backOffice/article?articleId=' + encodeURIComponent(this.props.params.articleId), restConfig).then(function(response) {
      var result = response.data;
      that.setState({article: result});
      if (result.paragraphs.length == 0) {
        that.setState({paragraphCount: 1});
      } else {
        that.setState({paragraphCount: result.paragraphs.length});
      }
      that.setArticleTypeSelection();
      that.setLanguageSelection();
      that.refs['editor'].refreshEditor();
    }).catch(function(response) {
      if (response instanceof Error) {
        console.error('Error', response.message);
      } else {
        console.error(response.data);
        console.error(response.status);
        console.error(response.headers);
        console.error(response.config);
      }
    });
  }

  setArticleTypeSelection() {
    for (var i = 0; i < this.refs['type-select'].options.length; i++) {
      if (this.refs['type-select'].options[i].value === this.state.article.articleType) {
        this.refs['type-select'].options[i].selected = true;
        break;
      }
    }
  }

  setLanguageSelection() {
    for (var i = 0; i < this.refs['language-select'].options.length; i++) {
      if (this.refs['language-select'].options[i].value === this.state.article.lang) {
        this.refs['language-select'].options[i].selected = true;
        break;
      }
    }
  }

  updateValue(toUpdate, value) {
    this.state.article[toUpdate] = value;
    this.forceUpdate();
  }

  updateArticleType(event) {
    this.state.article.articleType = event.target.value;
    this.forceUpdate();
  }

  updateLanguage(event) {
    this.state.article.lang = event.target.value;
    this.forceUpdate();
  }

  updateVisibility(event) {
    var value;
    if (event.target.value == '1') {
      value = true;
    } else {
      value = false;
    }
    this.state.article.visible = value;
    this.forceUpdate();
  }

  updateImage(imageName, file) {
    this.state.imageFile = file;
    if (file != null) {
      this.state.articleImageChanged = true;
    } else {
      this.state.articleImageChanged = false;
    }
    this.forceUpdate();
  }

  editArticle() {
    var that = this;
    var restConfig = getConfig();
    this.state.article.paragraphs = [];
    this.forceUpdate();

    for (var paragraph = 0; paragraph < this.state.paragraphCount; paragraph++) {
      this.state.article.paragraphs.push(this.refs['paragraph_' + paragraph].getParagraph());
    }

    axios.post('http://localhost:8082/backOffice/article/edit?userName=' + localStorage.getItem('username'), this.state.article, restConfig).then(function(response) {
      var article = response.data;
      if (that.state.articleImageChanged) {
        var data = new FormData();
        data.append('articleId', article.id);
        data.append('file', that.state.imageFile);
        axios.post('http://localhost:8082/article/upload/image', data, {}).then(function(response) {}).catch(function(response) {
          that.refs.notification.addNotification('Oh nein!', 'Beim Hochladen des Bildes für den Artikel ist ein Fehler aufgetreten.', 'error');
          if (response instanceof Error) {
            console.error('Error', response.message);
          } else {
            console.error(response.data);
            console.error(response.status);
            console.error(response.headers);
            console.error(response.config);
          }
        });
      }
      for (var paragraph = 0; paragraph < that.state.paragraphCount; paragraph++) {
        if (that.refs['paragraph_' + paragraph].getImageFile() != null) {
          var paragraphId = article.paragraphs[paragraph].id;
          var data = new FormData();
          data.append('articleId', article.id);
          data.append('paragraphId', paragraphId);
          data.append('file', that.refs['paragraph_' + paragraph].getImageFile());

          axios.post('http://localhost:8082/paragraph/upload/image', data, restConfig).then(function(response) {}).catch(function(response) {
            that.refs.notification.addNotification('Oh nein!', 'Beim Hochladen des Bildes für den Artikel ist ein Fehler aufgetreten.', 'error');
            if (response instanceof Error) {
              console.error('Error', response.message);
            } else {
              console.error(response.data);
              console.error(response.status);
              console.error(response.headers);
              console.error(response.config);
            }
          });
        }
      }
      that.refs.notification.addNotification('Geschafft!', 'Der Artikel wurde erfolgreich bearbeitet.', 'success');
    }).catch(function(response) {
      that.refs.notification.addNotification('Oh nein!', 'Beim Hochladen ist ein Fehler aufgetreten, wahrscheinlich ist beim Speichern etwas schief gelaufen.', 'error');
      if (response instanceof Error) {
        console.error('Error', response.message);
      } else {
        console.error(response.data);
        console.error(response.status);
        console.error(response.headers);
        console.error(response.config);
      }
    });
  }

  handleIntroContentChange(e) {
    var updatedArticle = this.state.article;
    updatedArticle.intro = e.target.getContent();
    this.setState({article: updatedArticle});
  }

  addParagraph() {
    this.state.paragraphCount++;
    this.forceUpdate();
  }

  render() {
    var that = this;
    var articleImgUrl = 'http://localhost:8082/article/image/' + this.state.article.id + '/' + this.state.article.imageFileName + '/380/253';
    var imageContent;
    if (!this.state.articleImageChanged && this.state.article.id != 0) {
      imageContent = <img src={articleImgUrl}/>;
    } else {
      imageContent = '';
    }
    var paragraphObjects = [];
    for (var paragraph = 0; paragraph < this.state.paragraphCount; paragraph++) {
      paragraphObjects.push(paragraph);
    }
    return (
      <div className="container paddingTopBottom15 article-manager">
        <div className="row ">
          <div className="col-md-12">
            <h1>Artikel bearbeiten</h1>
          </div>
        </div>
        <div className="row settings-row">
          <div className="col-md-2">
            Artikel-typ:
          </div>
          <div className="col-md-2">
            <select onChange={this.updateArticleType.bind(this)} ref="type-select">
              {this.state.articleTypes.map(function(articleType, i) {
                return (
                  <option value={articleType} key={i}>{articleType}</option>
                );
              })}
            </select>
          </div>
          <div className="col-md-2">
            Sprache:
          </div>
          <div className="col-md-2">
            <select ref="language-select" onChange={this.updateLanguage.bind(this)}>
              <option value="DEUTSCH">DEUTSCH</option>
              <option value="ENGLISH">ENGLISH</option>
            </select>
          </div>
          <div className="col-md-2">
            sichtbar:
          </div>
          <div className="col-md-2">
            <RadioButton id="radio-c-1" value="1" checked={this.state.article.visible} onChange={this.updateVisibility.bind(this)} text="&nbsp; ja&nbsp;&nbsp;"/>
            <RadioButton id="radio-c-0" value="0" checked={!this.state.article.visible} onChange={this.updateVisibility.bind(this)} text="&nbsp; nein"/>
          </div>
        </div>
        <div className="row content-row">
          <div className="col-md-2">
            Titel:
          </div>
          <div className="col-md-10 title">
            <input type="text" value={this.state.article.title} onChange={(event) => {
              this.updateValue('title', event.target.value);
            }}/>
          </div>
        </div>
        <div className="row content-row">
          <div className="col-md-2">
            Intro:
          </div>
          <div className="col-md-10">
            <TextEditor ref="editor" content={this.state.article.intro} handleContentChange={this.handleIntroContentChange.bind(this)}/>
          </div>
        </div>
        <div className="row image-row">
          <div className="col-md-2">
            Bild:
          </div>
          <div className="col-md-10">
            <FileChooser updateFile={this.updateImage.bind(this)}/> {imageContent}
          </div>
        </div>
        <div className="row image-row">
          <div className="col-md-2">
            Bildunterschrift:
          </div>
          <div className="col-md-10">
            <input type="text" value={this.state.article.imageDescription} onChange={(event) => {
              this.updateValue('imageDescription', event.target.value);
            }}/>
          </div>
        </div>
        {paragraphObjects.map(function(p, i) {
          if (i < that.state.article.paragraphs.length) {
            return (<Paragraph ref={'paragraph_' + i} key={i} articleId={that.state.article.id} paragraphNumber={i + 1} paragraph={that.state.article.paragraphs[i]}/>);
          } else {
            var paragraph = {
              id: null,
              title: '',
              text: '',
              imageFileName: '',
              imageDescription: ''
            };
            return (<Paragraph ref={'paragraph_' + i} key={i} articleId={that.state.article.id} paragraphNumber={i + 1} paragraph={paragraph}/>);
          }
        })}
        <div className="row">
          <div className="col-md-12 align-right">
            <IconButton glyphIcon="glyphicon-plus" text="PARAGRAPH HINZUFÜGEN" onClick={this.addParagraph.bind(this)}/>
          </div>
        </div>
        <div className="row align-center">
          <IconButton glyphIcon="glyphicon-floppy-open" text="ARTIKEL bearbeiten" onClick={this.editArticle.bind(this)}/>
        </div>
        <Notification ref="notification"/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
