import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import {browserHistory} from 'react-router';

import IconButton from '../../common/components/IconButton';
import Notification from '../../common/components/Notification';
import NotificationSystem from 'react-notification-system';
import FileChooser from '../../common/components/FileChooser';
import {getConfig} from '../../common/RestHelper';

require('./sliderImageManager.less');

class SliderImage extends Component {

  constructor(props) {
    super(props);
    var imageFileName = this.props.image.imageFileName == ''
      ? ''
      : this.props.image.imageFileName.substr(0, this.props.image.imageFileName.indexOf('.'));
    var fileEnding = this.props.image.imageFileName == ''
      ? ''
      : this.props.image.imageFileName.substr(this.props.image.imageFileName.indexOf('.'));
    this.state = {
      file: null,
      imageFileName: imageFileName,
      imageId: this.props.image.imageId,
      fileSrc: null,
      fileEnding: fileEnding
    };
  }

  updateValue(toUpdate, value) {
    this.state[toUpdate] = value;
    this.forceUpdate();
  }

  updateImage(imageName, file) {
    if (file != null) {
      var fileEnding = imageName != ''
        ? imageName.substr(imageName.indexOf('.'))
        : '';
      this.setState({file: file, fileEnding: fileEnding});
      var reader = new FileReader();
      var url = reader.readAsDataURL(file);
      reader.onloadend = function(e) {
        this.setState({
          fileSrc: [reader.result]
        });
      }.bind(this);
    } else {
      var imageFileName = this.props.image.imageFileName == ''
        ? ''
        : this.props.image.imageFileName.substr(0, this.props.image.imageFileName.indexOf('.'));
      var fileEnding = this.props.image.imageFileName == ''
        ? ''
        : this.props.image.imageFileName.substr(this.props.image.imageFileName.indexOf('.'));
      this.setState({imageFileName: imageFileName, file: file, fileEnding: fileEnding});
    }
    this.forceUpdate();
  }

  updateImageFromParent(image) {
    var imageFileName = image.imageFileName == ''
      ? ''
      : image.imageFileName.substr(0, image.imageFileName.indexOf('.'));
    var fileEnding = image.imageFileName == ''
      ? ''
      : image.imageFileName.substr(image.imageFileName.indexOf('.'));
    this.state = {
      file: null,
      imageFileName: imageFileName,
      imageId: image.imageId,
      fileSrc: null,
      fileEnding: fileEnding
    };
  }

  deleteImageConfirmation() {
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
            this.deleteImage();
          }}>OK</button>
        </div>
      )
    });
  }

  deleteImage() {
    if (this.state.imageId != null) {
      var that = this;
      var config = getConfig();
      axios.delete('http://localhost:8083/mainSliderImage/delete?imageId=' + this.state.imageId, config).then(function(response) {
        that.props.removeImage(that.props.arrayIndex);
      }).catch(function(response) {
        that.refs.notification.addNotification('Fehler!', response.data, 'error');
      });
    } else {
      this.props.removeImage(this.props.arrayIndex);
    }
  }

  saveImage() {
    var that = this;
    var imageFileName = this.state.imageFileName + this.state.fileEnding;
    var imageData = {
      imageId: this.state.imageId,
      imageFileName: imageFileName
    };
    var config = getConfig();
    if (imageData.imageFileName != '.jpg') {
      axios.post('http://localhost:8083/mainSliderImage/save', imageData, config).then(function(response) {
        if (that.state.file != null) {
          var imageId = response.data;
          var imageFile = new FormData();
          imageFile.append('imageId', imageId);
          imageFile.append('file', that.state.file);
          axios.post('http://localhost:8083/mainSliderImage/upload', imageFile, config).then(function(response) {
            that.updateImageData(response.data);
            that.refs.notification.addNotification('Geschafft!', 'Bild wurde hochgeladen!', 'success');
          }).catch(function(response) {
            that.refs.notification.addNotification('Fehler!', response.data, 'error');
          });
        } else {
          that.refs.notification.addNotification('Geschafft!', 'Daten wurden geupdatet!', 'success');
        }
      }).catch(function(response) {
        that.refs.notification.addNotification('Fehler!', response.data, 'error');
      });
    } else {
      that.refs.notification.addNotification('Fehler!', 'Bitte gib einen Dateinamen an!', 'error');
    }
  }

  updateImageData(image) {
    var imageFileName = image.imageFileName == ''
      ? ''
      : image.imageFileName.substr(0, image.imageFileName.indexOf('.'));
    var fileEnding = image.imageFileName == ''
      ? ''
      : image.imageFileName.substr(image.imageFileName.indexOf('.'));
    this.state = {
      imageFileName: imageFileName,
      imageId: image.imageId,
      fileSrc: null,
      fileEnding: fileEnding
    };
  }

  render() {
    var image;
    if (this.state.file != null) {
      image = <img src={this.state.fileSrc} height="320" width="570"/>;
    } else if (this.state.imageId != null) {
      let imageUrl = 'http://localhost:8081/mainSliderImage/' + this.state.imageFileName + this.state.fileEnding + '/570/320';
      image = <img src={imageUrl}/>;
    } else {
      image = '';
    }
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
      <div>
        <div className="row">
          <div className="col-md-4">
            Dateiname:
            <br/>
            <input type="text" value={this.state.imageFileName} onChange={(event) => {
              this.updateValue('imageFileName', event.target.value);
            }}/>&nbsp;{this.state.fileEnding}<br/>
            <FileChooser updateFile={this.updateImage.bind(this)}/>
            <IconButton glyphIcon="glyphicon-trash" text="BILD LÖSCHEN" onClick={this.deleteImageConfirmation.bind(this)}/><br/>
            <IconButton glyphIcon="glyphicon-floppy-save" text="BILD SPEICHERN" onClick={this.saveImage.bind(this)}/>
          </div>
          <div className="col-md-8">
            {image}
          </div>
        </div>
        <Notification ref="notification"/>
        <NotificationSystem ref="notificationSystem" style={style}/>
      </div>
    );
  }

}

export default class SliderImageManager extends Component {

  constructor() {
    super();
    this.state = {
      slides: []
    };
  }

  componentDidMount() {
    var that = this;
    axios.get('http://localhost:8081/mainSliderImages').then(function(response) {
      var result = response.data;
      that.setState({slides: result});
    }).catch(function(response) {});

  }

  removeImage(index) {
    this.state.slides.splice(index, 1);
    for (var image in this.state.slides) {
      this.refs['image_' + image].updateImageFromParent(this.state.slides[image]);
    }
    this.refs.notification.addNotification('Geschafft!', 'Bild wurde gelöscht.', 'success');
    this.forceUpdate();
  }

  createSliderImage(index) {
    return <SliderImage ref={'image_' + index} image={this.state.slides[index]} arrayIndex={index} key={index} removeImage={this.removeImage.bind(this)}/>;
  }

  createSliderImages() {
    var sliderImages = [];
    if (this.state.slides) {
      for (var image in this.state.slides) {
        sliderImages.push(this.createSliderImage(image));
      }
    } else {
      sliderImages = '';
    }
    return sliderImages;
  }

  addImage() {
    var image = {
      imageId: null,
      imageFileName: ''
    };
    this.state.slides.push(image);
    this.forceUpdate();

  }

  render() {
    var sliderImages = this.createSliderImages();

    return (
      <div className="container paddingTopBottom15 sliderImageManager">
        <div className="row ">
          <div className="col-md-12">
            <h1>Slider</h1>
          </div>
        </div>
        {sliderImages}
        <div className="row">
          <div className="col-md-12 align-right">
            <IconButton glyphIcon="glyphicon-plus" text="BILD HINZUFÜGEN" onClick={this.addImage.bind(this)}/>
          </div>
        </div>
        <Notification ref="notification"/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
