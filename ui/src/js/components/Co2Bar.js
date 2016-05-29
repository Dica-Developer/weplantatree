import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';

export default class Co2Bar extends Component {

  constructor() {
    super();
  }

  render() {
    let { co2 = 0, trees = 0 } = this.props;
    co2 = co2.toLocaleString();
    trees = trees.toLocaleString();
    return (
        <Row>
            <Col md={6}>
                <h3>{ co2 } <small>t CO2 gebunden</small></h3>
            </Col>
            <Col md={6}>
                <h3>{ trees } <small>Bäume gepflanzt</small></h3>
            </Col>
        </Row>
    );
  }
}

Co2Bar.propTypes = {
    'co2': PropTypes.number.isRequired,
    'trees': PropTypes.number.isRequired
};
