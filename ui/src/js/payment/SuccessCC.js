import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import axios from 'axios';
import Boostrap from 'bootstrap';

export default class SuccessCC extends Component {

  constructor(props) {
    super(props);
    this.state ={
      submitted: false
    };
  }

  componentDidMount(){
    var that = this;
    axios.post('http://localhost:8081/submitPlantBag?cartId=' + this.props.params.cartId, {}, {}).then(function(response) {
      that.setState({submitted: true});
    }).catch(function(response) {

      if (response instanceof Error) {
        console.error('Error', response.message);
      } else {
        console.error(response.data);
        console.error(response.status);
        console.error(response.headers);
        console.error(response.config);
      }
      console.error('Payment failed');
    });
  }

  render() {
    var content;
    if(this.state.submitted){
      content = <div className="col-md-12">
        <h1>Zahlung erfolgreich abgeschlossen!</h1>
          Vielen Dank für deine Spende!
      </div>;
    }else{
      content = '';
    }

    return (
      <div className="container paddingTopBottom15">
        <div className="row paymentPage">
          {content}
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
