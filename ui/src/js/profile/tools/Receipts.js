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

class Receipt extends Component {
  constructor(props) {
    super(props);
  }

  generateReceiptPdf(){
    window.open('http://localhost:8081/receipt/pdf?receiptId='+ this.props.receipt.receiptId);
  }

  render() {
    return (
      <div className="receipt">
        <a role="button" onClick={this.generateReceiptPdf.bind(this)}>
          <img src="/assets/images/receipt.jpg" alt="receipt" width="83" height="117"/><br/>
          {moment(this.props.receipt.createdOn).format('DD.MM.YYYY')}<br/>
          #{this.props.receipt.invoiceNumber}
        </a>
      </div>
    );
  }
}

export default class Receipts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receipts: []
    };
  }

  componentDidMount(){
    this.getReceipts();
  }

  getReceipts() {
    var that = this;
    var config = {
      headers: {
        'X-AUTH-TOKEN': localStorage.getItem('jwt')
      }
    };
    axios.get('http://localhost:8081/receipts', config).then(function(response) {
      var result = response.data;
      that.setState({
        receipts: result
      });
      console.log(result);
    });
  }

  render() {
    var text;
    if(this.state.receipts.length == 0){
      text = 'Für dich wurden bisher leider keine Spendenquittungen erstellt.';
    }else{
      text = 'Folgende Spendenquittung wurden bereits erstellt und sind verfügbar:';
    }


    return (
      <div className="row receipts">
        <div className="col-md-12">
          <h1>Spendenquittungen</h1>
        </div>
        <div className="col-md-12">
          {text}<br/>
          {this.state.receipts.map(function(receipt, i) {
            return (<Receipt key={i} receipt={receipt}/>);
          })}
        </div>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
