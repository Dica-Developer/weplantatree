import React, {Component} from 'react';
import Boostrap from 'bootstrap';
import axios from 'axios';
import moment from 'moment';

import {getTextForSelectedLanguage} from '../common/language/LanguageHelper';
import {htmlDecode} from '../common/language/HtmlHelper';

export default class ProjectCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fade: false
    };
    this.fadingDone = this.fadingDone.bind(this);
  }

  componentDidMount() {
    const elm = this.refs.carousel;
    elm.addEventListener('animationend', this.fadingDone);
  }
  componentWillUnmount() {
    const elm = this.refs.carousel;
    elm.removeEventListener('animationend', this.fadingDone);
  }
  fadingDone() {
    this.setState({fade: false});
  }

  render() {
    var projectName = this.props.projectName;

    return (
      <div ref="carousel" id="carousel-example-generic" className={(this.state.fade
        ? 'fadeOut'
        : 'fadeIn') + ' carousel slide'} data-ride="carousel">
        <div className="carousel-inner" role="listbox">
          {this.props.slides.map(function(slide, index) {
            var activeItem = 'item';
            if (0 === index) {
              activeItem = 'item active';
            }
            let imageUrl = 'http://localhost:8081/project/image/' + slide.imageFileName + '/1140/570';
            return (
              <div className={activeItem} key={index}>
                <img src={imageUrl} width="1140" height="570" alt={slide.imageFileName}/>
                <div className="imageDescription">
                  <span className="date">
                    <i>{moment(slide.date).format('DD.MM.YYYY')}</i>&nbsp;/&nbsp;</span>
                  <span className="text">{htmlDecode(getTextForSelectedLanguage(slide.description))}</span>
                </div>
              </div>
            );
          })}
        </div>
        <a className="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
          <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>
        <a className="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
          <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>
      </div>
    );
  }
}
