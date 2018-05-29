import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import Accounting from 'accounting';

import IconButton from '../common/components/IconButton';

require('./co2Calculator.less');

export default class Co2Calculator extends Component {

  constructor() {
    super();
    this.state = {
      foodResult: 0,
      foodMessage: 'Bitte füllen Sie alle Felder zur Berechnung aus.',
      mobilityResult: 0,
      mobilityMessage: 'Bitte füllen Sie alle Felder zur Berechnung aus.',
      mobilityProduction: 0,
      mobilityProductionMessage: 'Bitte füllen Sie alle Felder zur Berechnung aus.',
      flightResult: 0,
      flightMessage: 'Bitte füllen Sie alle Felder zur Berechnung aus.',
      homeResult: 0,
      homeMessage: 'Bitte füllen Sie alle Felder zur Berechnung aus.',
      overallResult: 0,
      overallMessage: '-'
    };
  }

  calcFoodResult() {
    let feedingResult = parseFloat(this.refs['feeding'].value);
    let foodAmountResult = parseFloat(this.refs['food-amount'].value);
    let foodLocalResult = parseFloat(this.refs['food-local'].value);
    let foodFrozenResult = parseFloat(this.refs['food-frozen'].value);
    let foodSaisonResult = parseFloat(this.refs['food-saison'].value);
    let foodBioResult = parseFloat(this.refs['food-bio'].value);
    let foodResult = feedingResult * foodAmountResult * foodLocalResult * foodFrozenResult * foodSaisonResult * foodBioResult;
    if (feedingResult !== 0 && foodAmountResult !== 0 && foodLocalResult !== 0 && foodFrozenResult !== 0 && foodSaisonResult !== 0 && foodBioResult !== 0) {
      this.state.foodMessage = '';
      this.state.foodResult = foodResult;
      this.forceUpdate();
      this.calcOverallResult();
    }
  }

  calcMobilityResult() {
    let mobilityResult = 0.01 * parseFloat(this.refs['fuel'].value) * parseFloat(this.refs['consumption'].value) * parseFloat(this.refs['range'].value);
    let mobilityProduction = 0.01 * parseFloat(this.refs['fuel'].value) * parseFloat(this.refs['consumption'].value) * 30000;
    if (mobilityResult !== 0 && mobilityProduction !== 0) {
      this.state.mobilityMessage = '';
      this.state.mobilityProductionMessage = '';
      this.state.mobilityResult = mobilityResult;
      this.state.mobilityProduction = mobilityProduction;
      this.forceUpdate();
      this.calcOverallResult();
    }
  }

  calcFlightResult() {
    let flightResult = 0.38 * parseFloat(this.refs['flight-range'].value);
    if (flightResult !== 0) {
      this.state.flightMessage = '';
      this.state.flightResult = flightResult;
      this.forceUpdate();
      this.calcOverallResult();
    }
  }

  calcHomeResult() {
    let houseTypeResult = parseFloat(this.refs['house-type'].value);
    let livingSpaceResult = parseFloat(this.refs['living-space'].value);
    let energyTypeResult = parseFloat(this.refs['energy-type'].value);
    let houseMemberCountResult = parseFloat(this.refs['house-member-count'].value);
    let powerTypeResult = parseFloat(this.refs['power-type'].value);
    let powerConsumptionResult = parseFloat(this.refs['power-consumption'].value);

    let homeResult = houseTypeResult * livingSpaceResult * energyTypeResult / houseMemberCountResult + powerTypeResult * powerConsumptionResult / houseMemberCountResult;
    if (!isNaN(houseTypeResult) && !isNaN(livingSpaceResult)  && !isNaN(energyTypeResult)  && !isNaN(houseMemberCountResult) && !isNaN(powerTypeResult) && !isNaN(powerConsumptionResult)) {
      this.state.homeMessage = '';
      this.state.homeResult = homeResult;
      this.forceUpdate();
      this.calcOverallResult();
    }
  }

  calcOverallResult() {
    let foodResult = parseFloat(this.state.foodResult);
    let mobilityResult = parseFloat(this.state.mobilityResult);
    let mobilityProduction = parseFloat(this.state.mobilityProduction);
    let flightResult = parseFloat(this.state.flightResult);
    let homeResult = parseFloat(this.state.homeResult);
    let overallResult = foodResult + mobilityResult + mobilityProduction + flightResult + homeResult;
    if (overallResult !== 0) {
      this.setState({
        overallMessage: ''
      });
      this.setState({
        overallResult: overallResult
      });
    }
  }

  render() {
    return (
      <div className="container paddingTopBottom15 co2Calculator">
        <div className="row">
          <div className="col-md-12 item-align-start">
            <h1>CO<sub>2</sub>-Rechner</h1>
          </div>
          <div className="col-md-12 item-align-start">
            <h2>1. Ernährung</h2>
          </div>
          <div className="col-md-6 item-align-start">
            <p>Wie setzt sich Deine Ernährung zusammen?</p>
          </div>
          <div className="col-md-6 item-align-start">
            <select className="form-control" ref="feeding" defaultValue={0} onChange={this.calcFoodResult.bind(this)}>
              <option value={0}>bitte auswählen</option>
              <option value={1}>vegan</option>
              <option value={1.167}>vegetarisch</option>
              <option value={1.334}>fleischreduziert</option>
              <option value={1.666}>Mischkost</option>
              <option value={2.167}>fleischbetont</option>
            </select>
          </div>
          <div className="col-md-6 item-align-start">
            <p>Wieviel isst Du gewöhnlich?</p>
          </div>
          <div className="col-md-6 item-align-start">
            <select className="form-control" ref="food-amount" defaultValue={0} onChange={this.calcFoodResult.bind(this)}>
              <option value={0}>bitte auswählen</option>
              <option value={1}>wenig</option>
              <option value={1.25}>normal</option>
              <option value={1.625}>viel</option>
            </select>
          </div>
          <div className="col-md-6 item-align-start">
            <p>Kaufst Du meistens regional?</p>
          </div>
          <div className="col-md-6 item-align-start">
            <select className="form-control" ref="food-local" defaultValue={0} onChange={this.calcFoodResult.bind(this)}>
              <option value={0}>bitte auswählen</option>
              <option value={1}>ja</option>
              <option value={1.111}>nein</option>
            </select>
          </div>
          <div className="col-md-6 item-align-start">
            <p>Wie oft isst Du Tiefkühlprodukte?</p>
          </div>
          <div className="col-md-6 item-align-start">
            <select className="form-control" ref="food-frozen" defaultValue={0} onChange={this.calcFoodResult.bind(this)}>
              <option value={0}>bitte auswählen</option>
              <option value={1}>nie</option>
              <option value={1.1}>selten</option>
              <option value={1.2}>oft</option>
            </select>
          </div>
          <div className="col-md-6 item-align-start">
            <p>Achtest Du auf die Saisonalität der Produkte?</p>
          </div>
          <div className="col-md-6 item-align-start">
            <select className="form-control" ref="food-saison" defaultValue={0} onChange={this.calcFoodResult.bind(this)}>
              <option value={0}>bitte auswählen</option>
              <option value={0.95}>ja</option>
              <option value={1}>nein</option>
            </select>
          </div>
          <div className="col-md-6 item-align-start">
            <p>Isst Du meistens Bio?</p>
          </div>
          <div className="col-md-6 item-align-start">
            <select className="form-control" ref="food-bio" defaultValue={0} onChange={this.calcFoodResult.bind(this)}>
              <option value={0}>bitte auswählen</option>
              <option value={0.94}>ja</option>
              <option value={1}>nein</option>
            </select>
          </div>
          <div className="col-md-6 item-align-start results">
            <div className="bold">
              {'Ergebnis:'}
            </div>
          </div>
          <div className="col-md-6 item-align-start results">
            <div className="bold">
              {this.state.foodMessage}
              {this.state.foodResult !== 0 &&
                <span>{Accounting.formatNumber(this.state.foodResult, 3, '.', ',')} kg CO<sub>2</sub></span>
              }
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 item-align-start">
            <h2>2. Mobilität</h2>
          </div>
          <div className="col-md-6 item-align-start">
            <p>Welchen Kraftstoff benutzt Dein Auto?</p>
          </div>
          <div className="col-md-6 item-align-start">
            <select className="form-control" ref="fuel" defaultValue={0} onChange={this.calcFoodResult.bind(this)}>
              <option value={0}>bitte auswählen</option>
              <option value={2.33}>Benzin</option>
              <option value={2.64}>Diesel</option>
              <option value={2.79}>Erdgas</option>
              <option value={1.64}>Flüssiggas</option>
              <option value={0.6}>Elektro</option>
            </select>
          </div>
          <div className="col-md-6 item-align-start">
            <p>Wie hoch ist dessen Verbrauch auf 100km (bitte ohne Einheit angeben)?*</p>
          </div>
          <div className="col-md-6 item-align-start">
            <input className="form-control" ref="consumption" type="text" placeholder="Bitte geben Sie den Verbrauch ein." onBlur={this.calcMobilityResult.bind(this)}></input>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 item-align-start">
            <p>Wieviele km bist Du gefahren?*</p>
          </div>
          <div className="col-md-6 item-align-start">
            <input className="form-control" ref="range" type="text" placeholder="Bitte geben Sie die gefahrene Strecke in km ein." onBlur={this.calcMobilityResult.bind(this)}></input>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 item-align-start results">
            <div className="bold">
              {'Ergebnis:'}
              <br/> {'Produktionsemission: '}
            </div>
          </div>
          <div className="col-md-6 item-align-start results">
            <div className="bold">
              {this.state.mobilityMessage}<br />
              {this.state.mobilityProductionMessage}
                {this.state.mobilityResult !== 0 &&
                  <span>{Accounting.formatNumber(this.state.mobilityResult, 3, '.', ',')} kg CO<sub>2</sub></span>
                }<br />
                {this.state.mobilityProduction !== 0 &&
                  <span>{Accounting.formatNumber(this.state.mobilityProduction, 3, '.', ',')} kg CO<sub>2</sub></span>
                }
            </div>
          </div>
          <div className="col-md-6 item-align-start">
            <p>Wieviele km bist Du geflogen?*</p>
          </div>
          <div className="col-md-6 item-align-start">
            <input className="form-control" ref="flight-range" type="text" placeholder="Bitte geben Sie die geflogene Strecke in km ein." onBlur={this.calcFlightResult.bind(this)}></input>
          </div>
          <div className="col-md-6 item-align-start results">
            <div className="bold">
              {'Ergebnis:'}
            </div>
          </div>
          <div className="col-md-6 item-align-start results">
            <div className="bold">
              {this.state.flightResult}
              {this.state.flightMessage !== 0 &&
                <span>{Accounting.formatNumber(this.state.flightResult, 3, '.', ',')} kg CO<sub>2</sub></span>
              }
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 item-align-start">
            <h2>3. Wohnen</h2>
          </div>
          <div className="col-md-6 item-align-start">
            <p>In welcher Hausart wohnst Du?</p>
          </div>
          <div className="col-md-6 item-align-start">
            <select className="form-control" ref="house-type" defaultValue={0} onChange={this.calcHomeResult.bind(this)}>
              <option value={0}>bitte auswählen</option>
              <option value={280}>Einfamilienhaus unsaniert</option>
              <option value={170}>Einfamilienhaus saniert</option>
              <option value={110}>Einfamilienhaus isoliert</option>
              <option value={200}>Mehrfamilienhaus unsaniert</option>
              <option value={120}>Mehrfamilienhaus saniert</option>
              <option value={90}>Mehrfamilienhaus isoliert</option>
              <option value={250}>Reihenhaus unsaniert</option>
              <option value={150}>Reihenhaus saniert</option>
              <option value={95}>Reihenhaus isoliert</option>
            </select>
          </div>
          <div className="col-md-6 item-align-start">
            <p>Welchen Energieträger nutzt Du?</p>
          </div>
          <div className="col-md-6 item-align-start">
            <select className="form-control" ref="energy-type" defaultValue={0} onChange={this.calcHomeResult.bind(this)}>
              <option value={0}>bitte auswählen</option>
              <option value={0.13}>Fernwärme</option>
              <option value={0.24}>Gas</option>
              <option value={0.302}>Heizöl</option>
              <option value={0.014}>Holz</option>
              <option value={0.395}>Steinkohle</option>
              <option value={0.481}>Braunkohle</option>
            </select>
          </div>
          <div className="col-md-6 item-align-start">
            <p>Wohnfläche in m²:*</p>
          </div>
          <div className="col-md-6 item-align-start">
            <input className="form-control" ref="living-space" type="text" placeholder="Bitte geben Sie die Wohnfläche ein." onBlur={this.calcHomeResult.bind(this)}></input>
          </div>
          <div className="col-md-6 item-align-start">
            <p>Wieviele Personen leben in dem Haushalt?</p>
          </div>
          <div className="col-md-6 item-align-start">
            <select className="form-control" ref="house-member-count" defaultValue={0} onChange={this.calcHomeResult.bind(this)}>
              <option value={0}>bitte auswählen</option>
              <option value={1}>1</option>
              <option value={1.55}>2</option>
              <option value={1.954}>3</option>
              <option value={2.252}>4</option>
              <option value={2.629}>5</option>
              <option value={2.882}>6 oder mehr</option>
            </select>
          </div>
          <div className="col-md-6 item-align-start">
            <p>Welche Stromart benutzt Du?</p>
          </div>
          <div className="col-md-6 item-align-start">
            <select className="form-control" ref="power-type" defaultValue={0} onChange={this.calcHomeResult.bind(this)}>
              <option value={0}>bitte auswählen</option>
              <option value={0.04}>Ökostrom</option>
              <option value={0.59}>Strommix</option>
            </select>
          </div>
          <div className="col-md-6 item-align-start">
            <p>Stromverbrauch in kWh:*</p>
          </div>
          <div className="col-md-6 item-align-start">
            <input className="form-control" ref="power-consumption" placeholder="Bitte geben Sie den Stromverbrauch ein." onBlur={this.calcHomeResult.bind(this)}></input>
          </div>
          <div className="col-md-6 item-align-start results">
            <div className="bold">
              {'Ergebnis:'}
            </div>
          </div>
          <div className="col-md-6 item-align-start results">
            <div className="bold">
              {this.state.homeMessage}
              {this.state.homeResult !== 0 &&
                <span>{Accounting.formatNumber(this.state.homeResult, 3, '.', ',')} kg CO<sub>2</sub></span>
              }
            </div>
          </div>
        </div>
        <div className="row overall-result">
          <div className="col-md-12 item-align-start">
            <h3>Gesamtergebnis</h3>
          </div>
          <div className="col-md-12 item-align-start results">
            <div className="bold">
              {this.state.overallMessage}
              {this.state.overallResult !== 0 &&
                <span>{Accounting.formatNumber(this.state.overallResult, 3, '.', ',')} kg CO<sub>2</sub></span>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
