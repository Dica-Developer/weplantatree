import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import {browserHistory} from 'react-router';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';

import IconButton from '../../common/components/IconButton';
import InputText from '../../common/components/InputText';
import TextEditor from '../../common/components/TextEditor';
import TextArea from '../../common/components/TextArea';
import Notification from '../../common/components/Notification';
import NotificationSystem from 'react-notification-system';
import RadioButton from '../../common/components/RadioButton';
import FileChooser from '../../common/components/FileChooser';
import {getConfig} from '../../common/RestHelper';

import {getTextForSelectedLanguage, getTextForLanguage, createMultiLanguageEntry} from '../../common/language/LanguageHelper';

require('./projectEditor.less');

class ProjectImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleDe: getTextForLanguage(this.props.projectImage.title, 'DEUTSCH'),
      titleEn: getTextForLanguage(this.props.projectImage.title, 'ENGLISH'),
      descriptionDe: getTextForLanguage(this.props.projectImage.description, 'DEUTSCH'),
      descriptionEn: getTextForLanguage(this.props.projectImage.description, 'ENGLISH'),
      projectId: this.props.projectId,
      file: null,
      imageFileName: this.props.projectImage.imageFileName,
      imageId: this.props.projectImage.imageId,
      fileSrc: null
    };
  }

  updateValue(toUpdate, value) {
    this.state[toUpdate] = value;
    this.forceUpdate();
  }

  createDeleteProjectImageConfirmation() {
    this.refs.notificationSystem.addNotification({
      title: 'Achtung!',
      position: 'tc',
      autoDismiss: 0,
      message: 'Möchtest du dieses Bild wirklich löschen?',
      level: 'warning',
      children: (
        <div>
          <button>Abbrechen</button>
          <button onClick={() => {
            this.deleteProjectImage();
          }}>OK</button>
        </div>
      )
    });
  }

  deleteProjectImage() {
    if (this.state.imageId != null) {
      var that = this;
      var config = getConfig();
      axios.post('http://localhost:8083/project/image/delete?projectImageId=' + this.state.imageId + '&imageFileName=' + this.state.imageFileName, {}, config).then(function(response) {
        that.props.removeProjectImage(that.props.arrayIndex);
        that.refs.notification.addNotification('Geschafft!', 'Bild wurde gelöscht.', 'success');
      }).catch(function(response) {
        that.refs.notification.addNotification('Fehler!', response.data, 'error');
      });
    } else {
      this.props.removeProjectImage(this.props.arrayIndex);
      this.refs.notification.addNotification('Geschafft!', 'Bild wurde gelöscht.', 'success');
    }
  }

  updateImageFromParent(projectImage) {
    this.state = {
      titleDe: getTextForLanguage(projectImage.title, 'DEUTSCH'),
      titleEn: getTextForLanguage(projectImage.title, 'ENGLISH'),
      descriptionDe: getTextForLanguage(projectImage.description, 'DEUTSCH'),
      descriptionEn: getTextForLanguage(projectImage.description, 'ENGLISH'),
      file: null,
      projectId: this.props.projectId,
      imageId: projectImage.imageId,
      imageFileName: projectImage.imageFileName,
      fileSrc: null
    };
    this.forceUpdate();
  }

  updateProjectId(projectId){
    this.setState({projectId: projectId});
  }

  createEditImage() {
    var that = this;
    var title = createMultiLanguageEntry(this.state.titleDe, this.state.titleEn);
    var description = createMultiLanguageEntry(this.state.descriptionDe, this.state.descriptionEn);

    var projectImageData = {
      imageId: this.state.imageId,
      title: title,
      description: description,
      projectId: this.state.projectId
    };

    var config = getConfig();
    if(this.state.projectId != null){
      axios.post('http://localhost:8083/project/image/createEdit', projectImageData, config).then(function(response) {
        if (that.state.file != null) {
          var imageId = response.data;
          var projectImageFile = new FormData();
          projectImageFile.append('imageId', imageId);
          projectImageFile.append('file', that.state.file);
          axios.post('http://localhost:8083/project/image/upload', projectImageFile, config).then(function(response) {
            that.refs.notification.addNotification('Geschafft!', 'Bild wurde hochgeladen!', 'success');
          }).catch(function(response) {
            that.refs.notification.addNotification('Fehler!', response.data+ response.message, 'error');
          });
        } else {
          that.refs.notification.addNotification('Geschafft!', 'Daten wurden geupdatet!', 'success');
        }
      }).catch(function(response) {
        that.refs.notification.addNotification('Fehler!', response.data + response.message, 'error');
      });
    }else{
        that.refs.notification.addNotification('Projekt ist noch nicht gespeichert!','Bitte speicher erst das Projekt ab, bevor du dazu ein Bild hochladen willst', 'error');
    }
  }

  updateImage(imageName, file) {
    this.setState({file: file});
    if (file != null) {
      var reader = new FileReader();
      var url = reader.readAsDataURL(file);
      reader.onloadend = function(e) {
        this.setState({
          fileSrc: [reader.result]
        });
      }.bind(this);
    }
    this.forceUpdate();
  }

  render() {
    var style = {
      Containers: {
        DefaultStyle: {
          zIndex: 11000
        },
        tc: {
          top: '50%',
          bottom: 'auto',
          margin: '0 auto',
          left: '50%'
        }
      }
    };
    var image;
    if (this.state.file != null) {
      image = <img src={this.state.fileSrc} height="300" width="400"/>;
    } else {
      let imageUrl = 'http://localhost:8081/project/image/' + this.state.imageFileName + '/400/300';
      image = <img src={imageUrl}/>;
    }
    return (
      <div className="projectImage">
        <div className="row">
          <div className="col-md-3">
            Titel:<br/>(deutsch)
          </div>
          <div className="col-md-3">
            <input type="text" value={this.state.titleDe} onChange={(event) => {
              this.updateValue('titleDe', event.target.value);
            }}/>
          </div>
          <div className="col-md-3">
            Titel:<br/>(englisch)
          </div>
          <div className="col-md-3">
            <input type="text" value={this.state.titleEn} onChange={(event) => {
              this.updateValue('titleEn', event.target.value);
            }}/>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            Text:<br/>(deutsch)
          </div>
          <div className="col-md-3">
            <textarea rows="4" cols="35" value={this.state.descriptionDe} onChange={(event) => {
              this.updateValue('descriptionDe', event.target.value);
            }}/>
          </div>
          <div className="col-md-3">
            Text:<br/>(englisch)
          </div>
          <div className="col-md-3">
            <textarea rows="4" cols="35" value={this.state.descriptionEn} onChange={(event) => {
              this.updateValue('descriptionEn', event.target.value);
            }}/>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4"><FileChooser updateFile={this.updateImage.bind(this)}/></div>
          <div className="col-md-8">
            {image}
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 align-center"></div>
        </div>
        <div className="row">
          <div className="col-md-12 align-right">
            <IconButton glyphIcon="glyphicon-trash" text="BILD LÖSCHEN" onClick={this.createDeleteProjectImageConfirmation.bind(this)}/><br/>
            <IconButton glyphIcon="glyphicon-floppy-save" text="BILD SPEICHERN" onClick={this.createEditImage.bind(this)}/>
          </div>
        </div>
        <Notification ref="notification"/>
        <NotificationSystem ref="notificationSystem" style={style}/>
      </div>
    );
  }
}

class ProjectArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      article: this.props.article,
      treeTypes: this.props.treeTypes
    };
  }

  componentDidMount() {
    this.preSelectTreeType();
  }

  preSelectTreeType() {
    for (var i = 0; i < this.refs.select.options.length; i++) {
      if (this.refs.select.options[i].value == this.state.article.treeType.id) {
        this.refs.select.options[i].selected = true;
        break;
      }
    }
  }

  updateValue(toUpdate, value) {
    this.state.article[toUpdate] = value;
    this.forceUpdate();
  }

  updatePriceValue(toUpdate, value) {
    this.state.article.price[toUpdate] = value;
    this.forceUpdate();
  }

  updateTreeType(event) {
    this.state.article.treeType.id = event.target.value;
    this.state.article.treeType.name = this.refs.select.options[this.refs.select.selectedIndex].text;
    this.forceUpdate();
  }

  createDeleteProjectArticleConfirmation() {
    this.refs.notificationSystem.addNotification({
      title: 'Achtung!',
      position: 'tc',
      autoDismiss: 0,
      message: 'Möchtest du diesen Baumtyp wirklich löschen?',
      level: 'warning',
      children: (
        <div>
          <button>Abbrechen</button>
          <button onClick={() => {
            this.deleteProjectArticle();
          }}>OK</button>
        </div>
      )
    });
  }

  deleteProjectArticle() {
    if (this.state.article.articleId != null) {
      var that = this;
      var config = getConfig();
      axios.post('http://localhost:8083/project/article/remove?articleId=' + this.state.article.articleId, {}, config).then(function(response) {
        that.refs.notification.addNotification('Geschafft!', 'Artikel wurde entfernt.', 'success');
        that.props.removeProjectArticle(that.props.arrayIndex);
      }).catch(function(response) {
        that.refs.notification.addNotification('Fehler!', response.data, 'error');
      });
    } else {
      this.refs.notification.addNotification('Geschafft!', 'Artikel wurde entfernt.', 'success');
      this.props.removeProjectArticle(this.props.arrayIndex);
    }
  }

  getArticle() {
    return this.state.article;
  }

  updateArticle(article) {
    this.setState({article: article});
    this.preSelectTreeType();
  }

  render() {
    var style = {
      Containers: {
        DefaultStyle: {
          zIndex: 11000
        },
        tc: {
          top: '50%',
          bottom: 'auto',
          margin: '0 auto',
          left: '50%'
        }
      }
    };
    return (
      <div className="row projectArticle">
        <div className="col-md-3">
          Baumtyp:
        </div>
        <div className="col-md-3">
          <select onChange={this.updateTreeType.bind(this)} ref="select">
            {this.state.treeTypes.map(function(treeType, i) {
              if (treeType.name == 'Default') {
                return (
                  <option value={treeType.id} key={i}>keiner der genannten</option>
                );
              } else {
                return (
                  <option value={treeType.id} key={i}>{getTextForSelectedLanguage(treeType.name)}</option>
                );
              }
            })}
          </select>
        </div>
        <div className="col-md-3">
          Anzahl:
        </div>
        <div className="col-md-3">
          <input type="text" value={this.state.article.amount} onChange={(event) => {
            this.updateValue('amount', event.target.value);
          }}/>
        </div>
        <div className="col-md-3">
          Preis:
        </div>
        <div className="col-md-3">
          <input type="text" value={this.state.article.price.amount} onChange={(event) => {
            this.updatePriceValue('amount', event.target.value);
          }}/>
        </div>
        <div className="col-md-3">
          Marge:
        </div>
        <div className="col-md-3">
          <input type="text" value={this.state.article.price.marge} onChange={(event) => {
            this.updatePriceValue('marge', event.target.value);
          }}/>
        </div>
        <div className="col-md-3">
          Funding:
        </div>
        <div className="col-md-3">
          <input type="text" value={this.state.article.price.funding} onChange={(event) => {
            this.updatePriceValue('funding', event.target.value);
          }}/>
        </div>
        <div className="col-md-3">
          Skonto:
        </div>
        <div className="col-md-3">
          <input type="text" value={this.state.article.price.sconto} onChange={(event) => {
            this.updatePriceValue('sconto', event.target.value);
          }}/>
        </div>
        <div className="col-md-12 align-left">
          <IconButton glyphIcon="glyphicon-trash" text="BAUMTYP LÖSCHEN" onClick={this.createDeleteProjectArticleConfirmation.bind(this)}/>
        </div>
        <Notification ref="notification"/>
        <NotificationSystem ref="notificationSystem" style={style}/>
      </div>
    );
  }
}
export default class ProjectEditor extends Component {

  constructor() {
    super();
    this.state = {
      project: {
        id: null,
        name: '',
        imageFileName: '',
        latitude: 0,
        longitude: 0,
        description: '',
        shopActive: false,
        visible: true,
        manager: {
          name: localStorage.getItem('username'),
          id: 1
        },
        articles: [],
        images: []
      },
      descriptionDe: '',
      descriptionEn: '',
      treeTypes: [],
      zoom: 8
    };
  }

  componentDidMount() {
    if (this.props.params.projectId != 'new') {
      this.loadProject();
    }
    this.loadTreeTypes();
  }

  loadProject() {
    var that = this;
    var config = getConfig();
    axios.get('http://localhost:8083/project?projectId=' + encodeURIComponent(this.props.params.projectId), config).then(function(response) {
      var result = response.data;
      var descriptionDe = getTextForLanguage(result.description, 'DEUTSCH');
      var descriptionEn = getTextForLanguage(result.description, 'ENGLISH');
      that.setState({project: result, descriptionDe: descriptionDe, descriptionEn: descriptionEn});
      that.refs['editor_de'].refreshEditor();
      that.refs['editor_en'].refreshEditor();
      axios.get('http://localhost:8083/project/articles?projectId=' + encodeURIComponent(that.props.params.projectId), config).then(function(response) {
        var result = response.data;
        that.state.project['articles'] = result;
        that.forceUpdate();
      });
      axios.get('http://localhost:8083/project/images?projectId=' + encodeURIComponent(that.props.params.projectId), config).then(function(response) {
        var result = response.data;
        that.state.project['images'] = result;
        that.forceUpdate();
      });
    });
  }

  loadTreeTypes() {
    var that = this;
    var config = getConfig();
    axios.get('http://localhost:8081/treeTypes', config).then(function(response) {
      var result = response.data;
      that.setState({treeTypes: result});
    }).catch(function(response) {
      that.refs.notification.addNotification('Fehler beim Laden der Baumtypen!', response.data + response.message, 'error');
    });

  }

  updateValue(toUpdate, value) {
    this.state.project[toUpdate] = value;
    this.forceUpdate();
  }

  handleDescriptionChangeForDe(e) {
    this.setState({descriptionDe: e.target.getContent()});
  }

  handleDescriptionChangeForEn(e) {
    this.setState({descriptionEn: e.target.getContent()});
  }

  updateVisibility(event) {
    var value;
    if (event.target.value == '1') {
      value = true;
    } else {
      value = false;
    }
    this.state.project.visible = value;
    this.forceUpdate();
  }

  updateShopActive(event) {
    var value;
    if (event.target.value == '1') {
      value = true;
    } else {
      value = false;
    }
    this.state.project.shopActive = value;
    this.forceUpdate();
  }

  updateProjectPositionFromMapClick(event) {
    this.state.zoom = this.refs.map.leafletElement._animateToZoom;
    this.state.project.latitude = parseFloat(event.latlng.lat);
    this.state.project.longitude = parseFloat(event.latlng.lng);
    this.forceUpdate();
  }

  updateProjectPositionFromMarkerDrag() {
    this.state.project.latitude = parseFloat(this.refs.marker.leafletElement._latlng.lat);
    this.state.project.longitude = parseFloat(this.refs.marker.leafletElement._latlng.lng);
    this.forceUpdate();
  }

  updateProject() {
    var that = this;
    var description = createMultiLanguageEntry(this.state.descriptionDe, this.state.descriptionEn);
    this.state.project.description = description;
    var config = getConfig();
    axios.post('http://localhost:8083/project/edit', this.state.project, config).then(function(response) {
      var projectId = response.data;
      that.state.project.id = projectId;
      for (var image in that.state.project.images) {
        that.refs['image_' + image].updateProjectId(projectId);
      }
      that.refs.notification.addNotification('Geschafft!', 'Projekt wurde aktualisiert.', 'success');
      that.forceUpdate();
    }).catch(function(response) {
      that.refs.notification.addNotification('Fehler!', 'Bei der Aktualisierung ist ein Fehler aufgetreten. ' + response.data + response.message, 'error');
    });
  }

  addProjectArticle() {
    var article = {
      amount: 0,
      articleId: null,
      price: {
        priceId: null,
        amount: 0.00,
        funding: 0,
        marge: 0.00,
        sconto: 0,
        scontoType: 'NONE'
      },
      treeType: {
        id: 1,
        name: 'Buche'
      }
    };
    this.state.project.articles.push(article);
    this.forceUpdate();
  }

  addProjectImage() {
    var image = {
      date: new Date().getTime(),
      description: '',
      imageFileName: '',
      title: '',
      imageId: null,
      projectId: this.state.project.projectId
    };
    this.state.project.images.push(image);
    this.forceUpdate();
  }

  removeProjectArticle(index) {
    this.state.project.articles.splice(index, 1);
    for (var article in this.state.project.articles) {
      this.refs['article_' + article].updateArticle(this.state.project.articles[article]);
    }
    this.forceUpdate();
  }

  removeProjectImage(index) {
    this.state.project.images.splice(index, 1);
    for (var image in this.state.project.images) {
      this.refs['image_' + image].updateImageFromParent(this.state.project.images[image]);
    }
    this.forceUpdate();
  }

  createProjectArticle(index) {
    return <ProjectArticle ref={'article_' + index} article={this.state.project.articles[index]} key={index} treeTypes={this.state.treeTypes} arrayIndex={index} removeProjectArticle={this.removeProjectArticle.bind(this)}/>;
  }

  createProjectArticles() {
    var articles = [];
    if (this.state.project.articles) {
      for (var article in this.state.project.articles) {
        articles.push(this.createProjectArticle(article));
      }
    } else {
      articles = '';
    }
    return articles;
  }

  createProjectImage(index) {
    return <ProjectImage ref={'image_' + index} projectImage={this.state.project.images[index]} projectId={this.state.project.id} arrayIndex={index} key={index} removeProjectImage={this.removeProjectImage.bind(this)}/>;
  }

  createProjectImages() {
    var projectImages = [];
    if (this.state.project.images) {
      for (var image in this.state.project.images) {
        projectImages.push(this.createProjectImage(image));
      }
    } else {
      projectImages = '';
    }
    return projectImages;
  }

  render() {
    var that = this;
    var articles = this.createProjectArticles();
    var projectImages = this.createProjectImages();

    return (
      <div className="container paddingTopBottom15 projectEditor">
        <div className="row ">
          <div className="col-md-12">
            <h1>Projekt-Editor</h1>
          </div>
        </div>
        <div className="row project-data">
          <div className="col-md-4">
            Projektname:
          </div>
          <div className="col-md-8">
            <input type="text" value={this.state.project.name} onChange={(event) => {
              this.updateValue('name', event.target.value);
            }}/>
          </div>
        </div>
        <div className="row project-data">
          <div className="col-md-4">
            sichtbar:
          </div>
          <div className="col-md-8">
            <RadioButton id="radio-c-1" value="1" checked={this.state.project.visible} onChange={this.updateVisibility.bind(this)} text="&nbsp; ja&nbsp;&nbsp;"/>
            <RadioButton id="radio-c-0" value="0" checked={!this.state.project.visible} onChange={this.updateVisibility.bind(this)} text="&nbsp; nein"/>
          </div>
        </div>
        <div className="row project-data">
          <div className="col-md-4">
            shop active:
          </div>
          <div className="col-md-8">
            <RadioButton id="radio-s-1" value="1" checked={this.state.project.shopActive} onChange={this.updateShopActive.bind(this)} text="&nbsp; ja&nbsp;&nbsp;"/>
            <RadioButton id="radio-s-0" value="0" checked={!this.state.project.shopActive} onChange={this.updateShopActive.bind(this)} text="&nbsp; nein"/>
          </div>
        </div>
        <div className="row project-data">
          <div className="col-md-4">
            Beschreibung:<br/>(deutsch)
          </div>
          <div className="col-md-8">
            <TextEditor ref="editor_de" content={this.state.descriptionDe} handleContentChange={this.handleDescriptionChangeForDe.bind(this)}/>
          </div>
        </div>
        <div className="row project-data">
          <div className="col-md-4">
            Beschreibung:<br/>(englisch)
          </div>
          <div className="col-md-8">
            <TextEditor ref="editor_en" content={this.state.descriptionEn} handleContentChange={this.handleDescriptionChangeForEn.bind(this)}/>
          </div>
        </div>
        <div className="row project-data">
          <div className="col-md-4">
            Lage:
          </div>
          <div className="col-md-8">
            <Map ref="map" center={[this.state.project.latitude, this.state.project.longitude]} zoom={this.state.zoom} onClick={this.updateProjectPositionFromMapClick.bind(this)}>
              <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
              <Marker position={[this.state.project.latitude, this.state.project.longitude]} draggable="true" ref="marker" onDragEnd={this.updateProjectPositionFromMarkerDrag.bind(this)}/>
            </Map>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <h3>Projektbäume:</h3>
          </div>
        </div>
        {articles}
        <div className="row">
          <div className="col-md-12 align-right">
            <IconButton glyphIcon="glyphicon-plus" text="BAUMTYP HINZUFÜGEN" onClick={this.addProjectArticle.bind(this)}/>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 align-center">
            <IconButton glyphIcon="glyphicon-floppy-open" text="ÄNDERUNGEN SPEICHERN" onClick={this.updateProject.bind(this)}/>
          </div>
        </div>
        <div className="row project-image-header">
          <div className="col-md-12">
            <h3>Projekt-Bilder editieren:</h3>
          </div>
        </div>
        {projectImages}
        <div className="row">
          <div className="col-md-12 align-right">
            <IconButton glyphIcon="glyphicon-plus" text="BILD HINZUFÜGEN" onClick={this.addProjectImage.bind(this)}/>
          </div>
        </div>
        <Notification ref="notification"/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
