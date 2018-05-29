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
import Notification from '../../common/components/Notification';
import {getConfig} from '../../common/RestHelper';

class Paragraph extends Component {
  constructor() {
    super();
    this.state = {
      imageFile: null,
      paragraph: {
        title: '',
        text: '',
        imageFileName: '',
        imageDescription: ''
      }
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

    return (
      <div>
        <div className="row content-row">
          <div className="col-md-12">
            <h4>Paragraph:</h4>
          </div>
        </div>
        <div className="row content-row">
          <div className="col-md-2">
            Titel:
          </div>
          <div className="col-md-10 title">
            <InputText toUpdate="title" updateValue={this.updateValue.bind(this)}/>
          </div>
        </div>
        <div className="row content-row">
          <div className="col-md-2">
            Inhalt:
          </div>
          <div className="col-md-10">
            <TinyMCE content="" config={{
              plugins: 'link table code',
              toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
              height: 300
            }} onChange={this.handleTextChange.bind(this)}/>
          </div>
        </div>
        <div className="row image-row">
          <div className="col-md-2">
            Bild:
          </div>
          <div className="col-md-10">
            <FileChooser updateFile={this.updateImage.bind(this)}/>
          </div>
        </div>
        <div className="row image-row">
          <div className="col-md-2">
            Bildunterschrift:
          </div>
          <div className="col-md-10">
            <InputText toUpdate="imageDescription" updateValue={this.updateValue.bind(this)}/>
          </div>
        </div>
      </div>
    );
  }
}

export default class ArticleCreater extends Component {

  constructor() {
    super();
    this.state = {
      articleTypes: [],
      imageFile: null,
      article: {
        title: '',
        articleType: 'HOME',
        intro: '',
        paragraphs: [{}],
        lang: 'DEUTSCH',
        visible: false,
        imageFileName: '',
        imageDescription: ''
      },
      paragraphCount: 1
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
    this.state.article.imageFileName = imageName;
    this.state.imageFile = file;
    this.forceUpdate();
  }

  createArticle() {
    var that = this;
    var restConfig = getConfig();
    if (this.state.imageFile != null) {
      for (var paragraph = 0; paragraph < this.state.article.paragraphs.length; paragraph++) {
        this.state.article.paragraphs[paragraph] = this.refs['paragraph_' + paragraph].getParagraph();
      }

      axios.post('http://localhost:8082/backOffice/article/create?userName=' + localStorage.getItem('username'), this.state.article, restConfig).then(function(response) {
        var article = response.data;
        var data = new FormData();
        data.append('articleId', article.id);
        data.append('file', that.state.imageFile);

        axios.post('http://localhost:8082/article/upload/image', data, restConfig).then(function(response) {}).catch(function(response) {
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
        for (var paragraph = 0; paragraph < that.state.paragraphCount; paragraph++) {
          if (that.refs['paragraph_' + paragraph].getImageFile() != null) {
            var paragraphId = article.paragraphs[paragraph].id;
            var data = new FormData();
            data.append('articleId', article.id);
            data.append('paragraphId', paragraphId);
            data.append('file', that.refs['paragraph_' + paragraph].getImageFile());

            axios.post('http://localhost:8082/paragraph/upload/image', data, restConfig).then(function(response) {}).catch(function(response) {
              that.refs.notification.addNotification('Oh nein!', 'Beim Hochladen des Bildes für den Paragraphen Nr. ' + paragraph + ' ist ein Fehler aufgetreten.', 'error');
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
        that.refs.notification.addNotification('Geschafft!', 'Der Artikel wurde erfolgreich hochgeladen.', 'success');
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
    } else {
      that.refs.notification.addNotification('Kein Bild!', 'Füge bitte noch ein Bild zu dem Artikel hinzu, das sieht sonst doof aus ohne.', 'error');
    }
  }

  handleIntroContentChange(e) {
    var updatedArticle = this.state.article;
    updatedArticle.intro = e.target.getContent();
    this.setState({article: updatedArticle});
  }

  addParagraph() {
    this.state.article.paragraphs.push({});
    this.forceUpdate();
  }

  render() {
    return (
      <div className="container paddingTopBottom15 article-manager">
        <div className="row ">
          <div className="col-md-12">
            <h1>Artikel erstellen</h1>
          </div>
        </div>
        <div className="row settings-row">
          <div className="col-md-2">
            Artikel-typ:
          </div>
          <div className="col-md-2">
            <select onChange={this.updateArticleType.bind(this)} ref="select">
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
            <select onChange={this.updateLanguage.bind(this)}>
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
            <InputText toUpdate="title" updateValue={this.updateValue.bind(this)}/>
          </div>
        </div>
        <div className="row content-row">
          <div className="col-md-2">
            Intro:
          </div>
          <div className="col-md-10">
            <TinyMCE content="" config={{
              plugins: 'link table code',
              toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
              height: 200
            }} onChange={this.handleIntroContentChange.bind(this)}/>
          </div>
        </div>
        <div className="row image-row">
          <div className="col-md-2">
            Bild:
          </div>
          <div className="col-md-10">
            <FileChooser updateFile={this.updateImage.bind(this)}/>
          </div>
        </div>
        <div className="row image-row">
          <div className="col-md-2">
            Bildunterschrift:
          </div>
          <div className="col-md-10">
            <InputText toUpdate="imageDescription" updateValue={this.updateValue.bind(this)}/>
          </div>
        </div>
        {this.state.article.paragraphs.map(function(paragraph, i) {
          return (<Paragraph ref={'paragraph_' + i} key={i}/>);
        })}
        <div className="row">
          <div className="col-md-12 align-right">
            <IconButton glyphIcon="glyphicon-plus" text="PARAGRAPH HINZUFÜGEN" onClick={this.addParagraph.bind(this)}/>
          </div>
        </div>
        <div className="row align-center">
          <IconButton glyphIcon="glyphicon-floppy-open" text="ARTIKEL HOCHLADEN" onClick={this.createArticle.bind(this)}/>
        </div>
        <Notification ref="notification"/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
