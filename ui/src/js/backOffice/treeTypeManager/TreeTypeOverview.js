import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';

import {
  getTextForSelectedLanguage,
  getTextForLanguage,
  createMultiLanguageEntry
} from '../../common/language/LanguageHelper';
import IconButton from '../../common/components/IconButton';
import FileChooser from '../../common/components/FileChooser';
import Notification from '../../common/components/Notification';
import NotificationSystem from 'react-notification-system';
import {getConfig} from '../../common/RestHelper';

require('./treeTypeOverview.less');

class TreeType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeType: this.props.treeType,
      nameDe: getTextForLanguage(this.props.treeType.name, 'DEUTSCH'),
      nameEn: getTextForLanguage(this.props.treeType.name, 'ENGLISH'),
      descriptionDe: getTextForLanguage(this.props.treeType.description, 'DEUTSCH'),
      descriptionEn: getTextForLanguage(this.props.treeType.description, 'ENGLISH'),
      imageFile: null,
      imageFileSrc: null
    };
  }

  updateValue(toUpdate, value) {
    this.state[toUpdate] = value;
    this.forceUpdate();
  }

  updateCo2(value) {
    this.state['treeType']['annualCo2SavingInTons'] = value;
    this.forceUpdate();
  }

  updateInfoLink(value) {
    this.state['treeType']['infoLink'] = value;
    this.forceUpdate();
  }

  createDeleteTreeTypeConfirmation() {
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
            this.deleteTreeType();
          }}>OK</button>
        </div>
      )
    });
  }

  save() {
    var that = this;
    var name = createMultiLanguageEntry(this.state.nameDe, this.state.nameEn);
    var description = createMultiLanguageEntry(this.state.descriptionDe, this.state.descriptionEn);
    this.state.treeType.name = name;
    this.state.treeType.description = description;
    var config = getConfig();
    axios.post('http://localhost:8083/treeType/save', this.state.treeType, config).then(function(response) {
        if (that.state.imageFile != null) {
          var treeTypeId = response.data;
          var treeTypeImageFile = new FormData();
          treeTypeImageFile.append('treeTypeId', treeTypeId);
          treeTypeImageFile.append('file', that.state.imageFile);
          axios.post('http://localhost:8083/treeType/imageUpload', treeTypeImageFile, config).then(function(response) {
            that.refs.notification.addNotification('Geschafft!', 'Baumtyp wurde gespeichert.', 'success');
          }).catch(function(response) {
              that.refs.notification.addNotification('Fehler!', response.data + response.message, 'error');
          });
        } else {
          that.refs.notification.addNotification('Geschafft!', 'Baumtyp wurde gespeichert.', 'success');
        }
    }).catch(function(response) {
    that.refs.notification.addNotification('Fehler!', response.data + response.message, 'error');
  });
}

updateTreeType(treeType) {
  this.setState({
    treeType: treeType,
    nameDe: getTextForLanguage(treeType.name, 'DEUTSCH'),
    nameEn: getTextForLanguage(treeType.name, 'ENGLISH'),
    descriptionDe: getTextForLanguage(treeType.description, 'DEUTSCH'),
    descriptionEn: getTextForLanguage(treeType.description, 'ENGLISH')
  });
}

deleteTreeType() {
  if (this.state.treeType.id != null) {
    var that = this;
    var config = getConfig();
    axios.delete('http://localhost:8083/treeType/delete?TreeTypeId=' + this.state.treeType.id, config).then(function(response) {
      that.refs.notification.addNotification('Geschafft!', 'Artikel wurde entfernt.', 'success');
      that.props.removeTreeType(that.props.index);
    }).catch(function(response) {
      that.refs.notification.addNotification('Fehler!', response.data + response.message, 'error');
    });
  } else {
    this.refs.notification.addNotification('Geschafft!', 'Artikel wurde entfernt.', 'success');
    this.props.removeTreeType(that.props.index);
  }
}

updateImage(imageName, imageFile) {
  this.setState({
    imageFile: imageFile
  });
  if (imageFile != null) {
    var reader = new FileReader();
    var url = reader.readAsDataURL(imageFile);
    reader.onloadend = function(e) {
      this.setState({
        imageFileSrc: [reader.result]
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
  if (this.state.imageFile != null) {
    image = <img src={this.state.imageFileSrc} height="150" width="150"/>;
  } else {
    let imageUrl = 'http://localhost:8081/treeType/image/' + this.state.treeType.imageFile + '/150/150';
    image = <img src={imageUrl}/>;
  }
  return (
    <div className="treeType row">
          <div className="col-md-2">Name(deutsch)</div>
          <div className="col-md-4"><input type="text" value={this.state.nameDe} onChange={(event) => {
            this.updateValue('nameDe', event.target.value);
          }}/></div>
          <div className="col-md-2">Name(englisch)</div>
          <div className="col-md-4"><input type="text" value={this.state.nameEn} onChange={(event) => {
            this.updateValue('nameEn', event.target.value);
          }}/></div>
          <div className="col-md-2">
            Beschreibung:<br/>(deutsch)
          </div>
          <div className="col-md-4">
            <textarea rows="4" cols="35" value={this.state.descriptionDe} onChange={(event) => {
              this.updateValue('descriptionDe', event.target.value);
            }}/>
          </div>
          <div className="col-md-2">
            Beschreibung:<br/>(englisch)
          </div>
          <div className="col-md-4">
            <textarea rows="4" cols="35" value={this.state.descriptionEn} onChange={(event) => {
              this.updateValue('descriptionEn', event.target.value);
            }}/>
          </div>
          <div className="col-md-2">Info-Link</div>
          <div className="col-md-4"><input type="text" value={this.state.treeType.infoLink == null ? '' : this.state.treeType.infoLink} onChange={(event) => {
            this.updateInfoLink(event.target.value);
          }}/></div>
          <div className="col-md-2">geb. CO<sub>2</sub>/Jahr</div>
          <div className="col-md-4"><input type="text" value={this.state.treeType.annualCo2SavingInTons} onChange={(event) => {
            this.updateCo2( event.target.value);
          }}/></div>
          <div className="col-md-2">Bild:
          </div>
          <div className="col-md-7">
          {image}
          </div>
          <div className="col-md-3"><div><FileChooser updateFile={this.updateImage.bind(this)}/></div>
          </div>
          <div className="col-md-12 align-right buttons">
            <IconButton glyphIcon="glyphicon-floppy-open" text="SPEICHERN" onClick={this.save.bind(this)}/>
            <IconButton glyphIcon="glyphicon-trash" text="BAUMTYP LÖSCHEN" onClick={this.createDeleteTreeTypeConfirmation.bind(this)}/>
          </div>
        <Notification ref="notification"/>
        <NotificationSystem ref="notificationSystem" style={style}/>
      </div>
  );
}
}

export default class TreeTypeOverview extends Component {

  constructor() {
    super();
    this.state = {
      treeTypes: []
    };
  }

  componentDidMount() {
    this.loadTreeTypes();
  }

  removeTreeType(index) {
    this.state.treeTypes.splice(index, 1);
    for (var treeType in this.state.treeTypes) {
      this.refs['treeType_' + treeType].updateTreeType(this.state.treeTypes[treeType]);
    }
    this.forceUpdate();
  }

  loadTreeTypes() {
    var that = this;
    var config = getConfig();
    axios.get('http://localhost:8083/treeTypes', config).then(function(response) {
      that.setState({
        treeTypes: response.data
      });
      that.forceUpdate();
    }).catch(function(response) {
      that.refs.notification.addNotification('Fehler beim Laden der Baumtypen!', response.data + response.message, 'error');
    });
  }

  addTreeType() {
    var name = createMultiLanguageEntry('', '');
    var description = createMultiLanguageEntry('', '');
    var treeType = {
      id: null,
      name: name,
      description: description,
      infoLink: '',
      imageFile: '',
      annualCo2SavingInTons: 0.0
    };
    this.state.treeTypes.push(treeType);
    this.forceUpdate();
  }

  createTreeType(index, treeType) {
    return <TreeType ref={'treeType_' + index} treeType={treeType} index={index} key={index} removeTreeType={this.removeTreeType.bind(this)}/>;
  }

  render() {
    var that = this;
    return (
      <div className="container paddingTopBottom15 treeTypeOverview">
        <div className="row ">
          <div className="col-md-12">
            <h1>Baumarten</h1>
          </div>
        </div>
          {this.state.treeTypes.map(function(treeType, i) {
            return (that.createTreeType(i, treeType));
          })}
          <div className="row">
            <div className="col-md-12 align-right">
              <IconButton glyphIcon="glyphicon-plus" text="BAUMTYP HINZUFÜGEN" onClick={this.addTreeType.bind(this)}/>
            </div>
          </div>
          <Notification ref="notification"/>
        </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
