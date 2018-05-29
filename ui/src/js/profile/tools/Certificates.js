import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import {
  Link
} from 'react-router';
import Boostrap from 'bootstrap';
import axios from 'axios';
import moment from 'moment';
import Accounting from 'accounting';

import Notification from '../../common/components/Notification';
import IconButton from '../../common/components/IconButton';
import TextArea from '../../common/components/TextArea';
import ButtonBar from './ButtonBar';

class PlantBag extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="certPlantBag">
        <div>
          <input type="checkbox" onChange={(event)=>{this.props.setPlantBagChosenFlag(this.props.index, event.target.checked);}}/>
        </div>
        <div>
          <p>
            <span className="bold">Anzahl:&nbsp;</span>{Accounting.formatNumber(this.props.plantBag.treeCount, 0, '.', ',')}<br/>
            <span className="bold">Datum:&nbsp;</span>
            <span >{moment(this.props.plantBag.timeStamp).format('DD.MM.YYYY')}</span><br/>
            <span className="bold">Preis:&nbsp;</span>{Accounting.formatNumber(this.props.plantBag.totalPrice, 2, '.', ',')}&nbsp;€
          </p>
        </div>
      </div>
    );
  }
}

export default class Certificates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plantBags: [],
      plantBagsChosen: [],
      certificateText: 'Mein ganz spezieller Beitrag zur Rettung unseres Planeten.',
      certificateTextLength: 58
    };
    this.setPlantBagChosenFlag = this.setPlantBagChosenFlag.bind(this);
  }

  componentDidMount() {
    this.getPlantBags();
  }

  getPlantBags() {
    var that = this;
    var config = {
      headers: {
        'X-AUTH-TOKEN': localStorage.getItem('jwt')
      }
    };
    axios.get('http://localhost:8081/carts/search/short/', config).then(function(response) {
      var result = response.data;
      that.initChoserArray(result.length);
      that.setState({
        plantBags: result
      });
    });
  }

  initChoserArray(length) {
    var plantBagsChosen = [];
    for (var i = 0; i < length; i++) {
      plantBagsChosen.push(false);
    }
    this.setState({
      plantBagsChosen: plantBagsChosen
    });
  }

  setPlantBagChosenFlag(index, value) {
    this.state.plantBagsChosen[index] = value;
    this.forceUpdate();
  }

  updateCertificateText(event) {
    this.setState({
      certificateText: event.target.value,
      certificateTextLength: event.target.value.length
    });
  }

  generateCertificate() {
    if(this.state.plantBagsChosen.every(elem => elem == false)){
      this.refs.notification.addNotification('Keine Pflanzkörbe ausgewählt!', 'Du musst mindestens einen Pflanzkorb ausgewählt haben.', 'error');
    }else {
      var requestItem = this.createCertificateRequestItem();
      var config = {
        headers: {
          'X-AUTH-TOKEN': localStorage.getItem('jwt')
        }
      };

      axios.post('http://localhost:8081/certificate/create',requestItem, config).then(function(response) {
        var result = response.data;
        window.open('http://localhost:8081/certificate/pdf/' + result);
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
  }

  createCertificateRequestItem() {
    var certificateRequestItem = {
      text: this.state.certificateText,
      cartIds: []
    };
    for (var i = 0; i < this.state.plantBags.length; i++) {
      if (this.state.plantBagsChosen[i]) {
        certificateRequestItem.cartIds.push(this.state.plantBags[i].id);
      }
    }
    return certificateRequestItem;
  }

  render() {
    var that = this;
    var content;
    if(this.state.plantBags.length == 0){
      content = <div className="content">Du hast bisher leider keine Bäume gepflanzt.</div>;
    }else{
      content =
        <div className="content">
            Bitte wähle die Pflanzkörbe aus, die im Zertifikat erscheinen sollen:<br/>
              {this.state.plantBags.map(function(plantBag, i) {
                return (<PlantBag plantBag={plantBag} key={i} index={i} setPlantBagChosenFlag={that.setPlantBagChosenFlag.bind(this)}/>);
              })}
            <br/>
            Dieser Text wird in deinem Zertifikat angezeigt:<br/>
            <textarea ref="certTextarea" rows="4" cols="50" maxLength="250" onChange={this.updateCertificateText.bind(this)} defaultValue="Mein ganz spezieller Beitrag zur Rettung unseres Planeten."/>
            <br/>({this.state.certificateTextLength}/250)
          <div className="align-center">
            <IconButton text="Zertifikat erstellen" glyphIcon="glyphicon-file" onClick={this.generateCertificate.bind(this)}/>
          </div>
        </div>;
    }

    return (
      <div className="col-md-12">
        <h1>Tools&nbsp;/&nbsp;Zertifikate</h1>
        {content}
        <ButtonBar switchTo={this.props.switchTo.bind(this)} chosen={this.props.view} />
        <Notification ref="notification"/>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
