import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import Accounting from 'accounting';
import PieChart from 'react-simple-pie-chart';
import {Link} from 'react-router';

import SvgButton from '../common/components/SvgButton';
import {getTextForSelectedLanguage} from '../common/language/LanguageHelper';

export default class ProjectDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fade: false
    };
    this.fadingDone = this.fadingDone.bind(this);
  }

  componentDidMount() {
    const elm = this.refs.details;
    elm.addEventListener('animationend', this.fadingDone);
  }
  componentWillUnmount() {
    const elm = this.refs.details;
    elm.removeEventListener('animationend', this.fadingDone);
  }
  fadingDone() {
    this.setState({fade: false});
  }

  render() {
    var percent = 0;
    var plantButton;
    if (this.props.project.projectReportData.amountOfMaximumTreesToPlant != 0) {
      percent = this.props.project.projectReportData.amountOfPlantedTrees / this.props.project.projectReportData.amountOfMaximumTreesToPlant * 100;
    }

    if (this.props.project.projectReportData.active) {
      plantButton = <SvgButton text="HIER PFLANZEN" buttonType="mouse" onClick={this.props.showPlanting.bind(this)} />;
    } else {
      plantButton = '';
    }

    var formattedPercent = Accounting.formatNumber(percent, 0, '.', ',');
    return (
      <div ref="details" className={(this.state.fade
        ? 'fadeOut'
        : 'fadeIn') + ' projectDetails'}>
        <h1>{'Projekt: '}
          <i>{this.props.project.projectReportData.projectName}</i>
        </h1>
        <table>
          <tbody>
            <tr>
              <td>
                <div className="floatRight">
                  <span className="greenValue">{formattedPercent}%</span><br/>
                  <span className="tableText">
                    <i>bepflanzt</i>
                  </span>
                </div>
              </td>
              <td className="midTd">
                <PieChart slices={[
                  {
                    color: '#82ab1f',
                    value: percent
                  }, {
                    color: '#fff',
                    value: 100 - percent
                  }
                ]}/>
              </td>
              <td >
                <span className="greenValue">{Accounting.formatNumber(this.props.project.projectReportData.amountOfPlantedTrees, 0, '.', ',')}</span><br/>
                <span className="tableText">
                  <i>von {Accounting.formatNumber(this.props.project.projectReportData.amountOfMaximumTreesToPlant, 0, '.', ',')}&nbsp;Bäumen</i>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="description">
          <p dangerouslySetInnerHTML={{
            __html: getTextForSelectedLanguage(this.props.project.projectReportData.description)
          }}/>
        </div>
        <div className="align-center spacing">
          {plantButton}
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
