import React, { Component } from 'react';
import axios from 'axios';

import NavBar from '../components/NavBar';
import Co2Bar from '../components/Co2Bar';
import Carousel from '../components/Carousel';
import Teaser from '../components/Teaser';
import Footer from '../components/Footer';

function initialState() {
  return {
    'co2': 0,
    'trees': 0
  }
}
function updateCo2State(state, co2Response) {
  const { co2, treesCount } = co2Response.data;

  return Object.assign(
    {},
    state,
    { 'co2': co2, 'trees': treesCount }
  );
}
const MainPage = React.createClass({
  getInitialState: () => {
    return initialState();
  },

  componentDidMount: function(){
    axios
      .get('http://localhost:8081/reports/co2')
      .then((co2Response) => {
        let newState = updateCo2State(this.state, co2Response);
        this.setState(newState);
      });
  },

  render: function() {
    const { co2, trees } = this.state;

    return (
      <div>
        <NavBar/>
        <div className="container">
          <Co2Bar co2={co2} trees={trees} />
          <Carousel />
          <Teaser />
        </div>
        <Footer/>
      </div>);
  }
});
export default MainPage;
