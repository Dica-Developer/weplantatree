import axios from 'axios';
import counterpart from 'counterpart';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { slideToggle } from '../../3rd/jquery-alternative';
import IconButton from '../../common/components/IconButton';
import Notification from '../../common/components/Notification';
import BottomPart from '../BottomPart';
import ButtonBar from '../ButtonBar';
import PlantItem from './PlantItem';

require('./proposalPlantPage.less');

export default class ProposalPlantPage extends Component {
  constructor() {
    super();
    this.state = {
      trees: {
        plantItems: []
      },
      overallPrice: 0,
      amount: -1,
      slideIn: false,
      areThereTreesToPlant: true,
      errorMessages: []
    };
    this.toggleDiv = this.toggleDiv.bind(this);
  }

  componentDidMount() {
    localStorage.setItem('isGift', this.props.route.isGift);
    this.setState({ amount: this.props.params.amount });
    this.getPlantProposal(this.props.params.amount);
  }

  toggleDiv() {
    slideToggle(this.refs['plantItems'], 800);
  }

  updatePlantBag() {
    for (var plantItem in this.state.trees.plantItems) {
      var price = this.state.trees.plantItems[plantItem].amount * this.state.trees.plantItems[plantItem].treePrice;
      var projectItems = {};
      projectItems[this.state.trees.plantItems[plantItem].treeType] = {
        amount: parseInt(this.state.trees.plantItems[plantItem].amount),
        price: parseInt(this.state.trees.plantItems[plantItem].treePrice),
        imageFile: this.state.trees.plantItems[plantItem].imageFile
      };
      this.props.route.updatePlantBag(price, projectItems, this.state.trees.plantItems[plantItem].projectName, this.props.route.isGift);
    }
  }

  getPlantProposal(value) {
    var that = this;
    this.toggleDiv();
    axios
      .get('http://localhost:8081/simplePlantProposalForTrees/' + value)
      .then(function(response) {
        var result = response.data;
        setTimeout(function() {
          that.setState({ trees: result });
          that.toggleDiv();
        }, 1000);
      })
      .catch(function(error) {
        if (error.response.status == 400) {
          let messages = [];
          for (let errorInfo of error.response.data.errorInfos) {
            messages.push(counterpart.translate(errorInfo.errorCode));
          }
          that.setState({ areThereTreesToPlant: false, errorMessages: messages });
        } else {
          that.refs.notification.handleError(error);
        }
      });
  }

  componentDidUpdate() {
    if (this.state.amount != this.props.params.amount) {
      this.setState({ amount: this.props.params.amount });
      this.getPlantProposal(this.props.params.amount);
    }
  }

  sleep(milliseconds) {
    var e = new Date().getTime() + milliseconds;
    while (new Date().getTime() <= e) {}
  }

  switchToOfferProjectPage() {
    browserHistory.push('/projectOffer');
  }

  switchToContactPage() {
    browserHistory.push('/contact');
  }

  render() {
    var chosen;
    if (this.props.params.amount == '1' || this.props.params.amount == '5' || this.props.params.amount == '10' || this.props.params.amount == '50' || this.props.params.amount == '100') {
      chosen = this.props.params.amount;
    } else {
      chosen = 'customAmount';
    }
    return (
      <div className="container paddingTopBottom15">
        <div className="row proposalPlantPage">
          <div className="col-md-12">
            <h1>{this.props.route.header}</h1>
            <div className={this.state.areThereTreesToPlant ? '' : 'no-display'}>
              <ButtonBar chosen={chosen} />
            </div>
            <div className={'align-center bold plantItemDesc ' + (this.state.areThereTreesToPlant ? '' : 'no-display')}>
              <div></div>
              <div>
                <p>
                  {counterpart.translate('TREETYPE')}
                  <br />
                  {counterpart.translate('PRICE_PER_ITEM')}
                </p>
              </div>
              <div>{counterpart.translate('NUMBER')}</div>
              <div>{counterpart.translate('PROJECT')}</div>
              <div></div>
              <div>{counterpart.translate('SUB_TOTAL')}</div>
            </div>
            <div ref="plantItems" className={'plantItems align-center'}>
              {this.state.trees.plantItems.map(function(plantItem, i) {
                return <PlantItem plantItem={plantItem} key={i} />;
              })}
            </div>
            <div className={!this.state.areThereTreesToPlant ? '' : 'no-display'}>
              {this.state.errorMessages.map(function(message, i) {
                return (
                  <p className="align-center error-message" key={i}>
                    {message}
                  </p>
                );
              })}
              <div className="align-center col-md-12 offer-acreage">
                <p>{counterpart.translate('AREA_QUESTION')}</p>
                <IconButton glyphIcon="glyphicon-forward" text={counterpart.translate('OFFER_AREA')} onClick={this.switchToOfferProjectPage.bind(this)} />
              </div>
              <div className="align-center col-md-12 offer-acreage">
                <p>{counterpart.translate('HELP_WITH_NO_TREE_DONATION')}</p>
                <IconButton glyphIcon="glyphicon-forward" text={counterpart.translate('CONTACT')} onClick={this.switchToContactPage.bind(this)} />
              </div>
            </div>
            <div className={this.state.areThereTreesToPlant ? '' : 'no-display'}>
              <BottomPart updatePlantBag={this.updatePlantBag.bind(this)} overallPrice={this.state.trees.actualPrice} />
            </div>
          </div>
        </div>
        <Notification ref="notification" />
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
