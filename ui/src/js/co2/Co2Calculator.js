import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import Accounting from 'accounting';

import IconButton from '../common/components/IconButton';

require("./co2Calculator.less");

export default class Co2Calculator extends Component {

  constructor() {
    super();
    this.state = {
      foodResult: 0,
      mobilityResult: 0,
      mobilityProduction: 0,
      flightResult: 0,
      homeResult: 0,
      overallResult: 0
    }
  }

  calcFoodResult() {
    var result = parseFloat(this.refs["feeding"].value) * parseFloat(this.refs["food-amount"].value) * parseFloat(this.refs["food-local"].value) * parseFloat(this.refs["food-frozen"].value) * parseFloat(this.refs["food-saison"].value) * parseFloat(this.refs["food-bio"].value);
    if(isNaN(result)){
      result = 0;
    }
    this.setState({foodResult: result});
  }

  calcMobilityResult() {
    var mobilityResult = 0.01 * parseFloat(this.refs["fuel"].value) * parseFloat(this.refs["consumption"].value) * parseFloat(this.refs["range"].value);
    var mobilityProduction = 0.01 * parseFloat(this.refs["fuel"].value) * parseFloat(this.refs["consumption"].value) * 30000;
    if(isNaN(mobilityResult)){
      mobilityResult = 0;
    }
    if(isNaN(mobilityProduction)){
      mobilityProduction = 0;
    }
    this.setState({mobilityResult: mobilityResult, mobilityProduction: mobilityProduction});
  }

  calcFlightResult() {
    var flightResult = 0.38 * parseFloat(this.refs["flight-range"].value);
    if(isNaN(flightResult)){
      flightResult = 0;
    }
    this.setState({flightResult: flightResult});
  }

  calcHomeResult(){
    var homeResult = parseFloat(this.refs["house-type"].value) * parseFloat(this.refs["living-space"].value) * parseFloat(this.refs["energy-type"].value) / parseFloat(this.refs["house-member-count"].value) + parseFloat(this.refs["power-type"].value) * parseFloat(this.refs["power-consumption"].value) /  parseFloat(this.refs["house-member-count"].value) ;
    if(isNaN(homeResult)){
      homeResult = 0;
    }
    this.setState({homeResult: homeResult});
  }

  calcOverallResult(){
    this.calcFoodResult();
    this.calcMobilityResult();
    this.calcFlightResult();
    this.calcHomeResult();
    this.forceUpdate();
    this.state.overallResult = this.state.foodResult + this.state.mobilityResult + this.state.mobilityProduction + this.state.flightResult + this.state.homeResult;
    this.forceUpdate();
  }

  render() {
    var result1 = 0;
    return (
      <div className="container paddingTopBottom15 co2Calculator">
        <div className="row ">
          <div className="col-md-12">
            <h2>CO<sub>2</sub>-Rechner</h2>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-12">
            <h3>Ernährung</h3>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-6">
            Wie setzt sich Deine Ernährung zusammen?
          </div>
          <div className="col-md-6">
            <select ref="feeding" defaultValue={0}>
              <option value={0} disabled>bitte auswählen</option>
              <option value={1}>vegan</option>
              <option value={1.167}>vegetarisch</option>
              <option value={1.334}>fleischreduziert</option>
              <option value={1.666}>Mischkost</option>
              <option value={2.167}>fleischbetont</option>
            </select>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-6">
            Wieviel isst du gewöhnlich?
          </div>
          <div className="col-md-6">
            <select ref="food-amount" defaultValue={0}>
              <option value={0} disabled>bitte auswählen</option>
              <option value={1}>wenig</option>
              <option value={1.25}>normal</option>
              <option value={1.625}>viel</option>
            </select>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-6">
            Kaufst Du meistens regional?
          </div>
          <div className="col-md-6">
            <select ref="food-local" defaultValue={0}>
              <option value={0} disabled>bitte auswählen</option>
              <option value={1}>ja</option>
              <option value={1.111}>nein</option>
            </select>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-6">
            Wie oft isst Du Tiefkühlprodukte?
          </div>
          <div className="col-md-6">
            <select ref="food-frozen" defaultValue={0}>
              <option value={0} disabled>bitte auswählen</option>
              <option value={1}>nie</option>
              <option value={1.1}>selten</option>
              <option value={1.2}>oft</option>
            </select>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-6">
            Achtest Du auf die Saisonalität der Produkte?
          </div>
          <div className="col-md-6">
            <select ref="food-saison" defaultValue={0}>
              <option value={0} disabled>bitte auswählen</option>
              <option value={0.95}>ja</option>
              <option value={1}>nein</option>
            </select>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-6">
            Isst Du meistens Bio?
          </div>
          <div className="col-md-6">
            <select ref="food-bio" defaultValue={0}>
              <option value={0} disabled>bitte auswählen</option>
              <option value={0.94}>ja</option>
              <option value={1}>nein</option>
            </select>
            <button className="calcButton" onClick={this.calcFoodResult.bind(this)}>berechnen</button>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-6">
            <div className={this.state.foodResult != 0
              ? "bold"
              : "no-display"}>
              {"Ergebnis:"}
            </div>
          </div>
          <div className="col-md-6">
            <div className={this.state.foodResult != 0
              ? "bold"
              : "no-display"}>
              {Accounting.formatNumber(this.state.foodResult, 3, ".", ",")}
              {" kg CO"}<sub>2</sub>
            </div>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-12">
            <div className="line"></div>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-12">
            <h3>Mobilität</h3>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-6">
            Welchen Kraftstoff benutzt Dein Auto?
          </div>
          <div className="col-md-6">
            <select ref="fuel" defaultValue={0}>
              <option value={0} disabled>bitte auswählen</option>
              <option value={2.33}>Benzin</option>
              <option value={2.64}>Diesel</option>
              <option value={2.79}>Erdgas</option>
              <option value={1.64}>Flüssiggas</option>
              <option value={0.6}>Elektro</option>
            </select>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-6">
            Wie hoch ist dessen Verbrauch auf 100km?(bitte ohne EInheit angeben)
          </div>
          <div className="col-md-6">
            <input ref="consumption" type="text"></input>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-6">
            Wieviele km bist du gefahren?
          </div>
          <div className="col-md-6">
            <input ref="range" type="text"></input>
            <button className="calcButton" onClick={this.calcMobilityResult.bind(this)}>berechnen</button>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-6">
            <div className={this.state.mobilityResult != 0
              ? "bold"
              : "no-display"}>
              {"Ergebnis:"}
              <br/> {"Produktionsemission: "}
            </div>
          </div>
          <div className="col-md-6">
            <div className={this.state.mobilityResult != 0
              ? "bold"
              : "no-display"}>
              {Accounting.formatNumber(this.state.mobilityResult, 3, ".", ",")}
              {" kg CO"}<sub>2</sub><br/> {Accounting.formatNumber(this.state.mobilityProduction, 3, ".", ",")}
              {" kg CO"}<sub>2</sub>
            </div>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-12">
            <div className="dashed-line"></div>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-6">
            Wieviele km bist du geflogen?
          </div>
          <div className="col-md-6">
            <input ref="flight-range" type="text"></input>
            <button className="calcButton" onClick={this.calcFlightResult.bind(this)}>berechnen</button>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-6">
            <div className={this.state.flightResult != 0
              ? "bold"
              : "no-display"}>
              {"Ergebnis:"}
            </div>
          </div>
          <div className="col-md-6">
            <div className={this.state.flightResult != 0
              ? "bold"
              : "no-display"}>
              {Accounting.formatNumber(this.state.flightResult, 3, ".", ",")}
              {" kg CO"}<sub>2</sub>
            </div>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-12">
            <div className="line"></div>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-12">
            <h3>Wohnen</h3>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-6">
            In welcher Hausart wohnst Du?
          </div>
          <div className="col-md-6">
            <select ref="house-type" defaultValue={0}>
              <option value={0} disabled>bitte auswählen</option>
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
        </div>
        <div className="row ">
          <div className="col-md-6">
            Welchen Energieträger nutzt du?
          </div>
          <div className="col-md-6">
            <select ref="energy-type" defaultValue={0}>
              <option value={0} disabled>bitte auswählen</option>
              <option value={0.13}>Fernwärme</option>
              <option value={0.24}>Gas</option>
              <option value={0.302}>Heizöl</option>
              <option value={0.014}>Holz</option>
              <option value={0.395}>Steinkohle</option>
              <option value={0.481}>Braunkohle</option>
            </select>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-6">
            Wohnfläche in m²:
          </div>
          <div className="col-md-6">
            <input ref="living-space" type="text"></input>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-6">
            Wieviele Personen leben in dem Haushalt?
          </div>
          <div className="col-md-6">
            <select ref="house-member-count" defaultValue={0}>
              <option value={0} disabled>bitte auswählen</option>
              <option value={1}>1</option>
              <option value={1.55}>2</option>
              <option value={1.954}>3</option>
              <option value={2.252}>4</option>
              <option value={2.629}>5</option>
              <option value={2.882}>6 oder meht</option>
            </select>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-6">
            Welche Stromart benutzt Du?
          </div>
          <div className="col-md-6">
            <select ref="power-type" defaultValue={0}>
              <option value={0} disabled>bitte auswählen</option>
              <option value={0.04}>Ökostrom</option>
              <option value={0.59}>Strommix</option>
            </select>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-6">
            Stromverbrauch in kWh:
          </div>
          <div className="col-md-6">
            <input ref="power-consumption" type="text"></input>
            <button className="calcButton" onClick={this.calcHomeResult.bind(this)}>berechnen</button>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-6">
            <div className={this.state.homeResult != 0
              ? "bold"
              : "no-display"}>
              {"Ergebnis:"}
            </div>
          </div>
          <div className="col-md-6">
            <div className={this.state.homeResult != 0
              ? "bold"
              : "no-display"}>
              {Accounting.formatNumber(this.state.homeResult, 3, ".", ",")}
              {" kg CO"}<sub>2</sub>
            </div>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-12">
            <div className="line"></div>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-12">
            <h3>Gesamtergebnis</h3>
            <button className="calcButton" onClick={this.calcOverallResult.bind(this)}>berechnen</button>
            <div className={this.state.homeResult != 0
              ? "bold overall-result"
              : "no-display"}>
              {Accounting.formatNumber(this.state.overallResult, 3, ".", ",")}
              {" kg CO"}<sub>2</sub>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
