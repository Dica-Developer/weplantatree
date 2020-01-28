import Accounting from 'accounting';
import axios from 'axios';
import moment from 'dayjs';
import React, { Component } from 'react';
import DatePicker from 'react-16-bootstrap-date-picker';
import ReactDataGrid from 'react-data-grid';
import { Data, Toolbar } from 'react-data-grid-addons';
import NotificationSystem from 'react-notification-system';
import Select from 'react-select';
import IconButton from '../../common/components/IconButton';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import Notification from '../../common/components/Notification';
import { getTextForSelectedLanguage } from '../../common/language/LanguageHelper';
import { getConfig } from '../../common/RestHelper';


require('./cartOverview.less');

class CartDetails extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    var cartItems = 'no cartitems available';
    var display = 'none';
    if (this.props.details.cartItems) {
      cartItems = <CartItems cartItems={this.props.details.cartItems}/>;
      display = 'block';
    }
    var x = this.props.x - 665;
    var y = this.props.y + 25;
    return (
      <div style={{
        display: display,
        position: 'absolute',
        left: x,
        top: y,
        width: '650px'
      }} className="cart-details">
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-3">
                <strong>Datum:</strong>
              </div>
              <div className="col-md-9">
                {moment(this.props.details.timeStamp).format('DD.MM.YYYY')}
              </div>
              <div className="col-md-3">
                <strong>Anzahl Bäume:</strong>
              </div>
              <div className="col-md-9">
                {this.props.details.treeCount}
              </div>
              <div className="col-md-3">
                <strong>Preis:</strong>
              </div>
              <div className="col-md-9">
                {Accounting.formatNumber(this.props.details.totalPrice, 2, '.', ',')}
              </div>
            </div>
            {cartItems}
          </div>
        </div>
      </div>
    );
  }
}

class CartItems extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <div className="cart-items">
        <div className="row">
          <div className="col-md-3">
            <strong>Baum-Art</strong>
          </div>
          <div className="col-md-3">
            <strong>Projekt</strong>
          </div>
          <div className="col-md-2 align-center">
            <strong>Anzahl</strong>
          </div>
          <div className="col-md-2 align-center">
            <strong>Preis/Stk</strong>
          </div>
          <div className="col-md-2">
          </div>
        </div>
        {this.props.cartItems.map(function(cartItem, i) {
          var treeTypeName = 'Baum wurde entfernt';
          var project = 'unbekannt';
          if (cartItem.tree) {
            treeTypeName = getTextForSelectedLanguage(cartItem.tree.treeType.name);
            project = cartItem.tree.projectArticle.project.name;
          }
          return (
            <div className="row" key={i}>
              <div className="col-md-3">{treeTypeName}</div>
              <div className="col-md-3">{project}</div>
              <div className="col-md-2 align-center">{cartItem.amount}</div>
              <div className="col-md-2 align-center">{Accounting.formatNumber(cartItem.basePricePerPiece, 2, '.', ',')}</div>
              <div className="col-md-2"><strong>=> </strong>{Accounting.formatNumber(cartItem.totalPrice, 2, '.', ',')}</div>
            </div>
          );
        })}
      </div>
    );
  }
}
export default class CartOverview extends Component {
  constructor() {
    super();
    this.state = {
      carts: [],
      columns: [
        {
          key: 'id',
          name: 'ID',
          width: 60,
          filterable: true,
          sortable: true,
          visible: false
        }, {
          key: 'user',
          name: 'User',
          width: 120,
          filterable: true,
          sortable: true,
          visible: true
        }, {
          key: 'price',
          name: 'Preis (€)',
          width: 60,
          filterable: true,
          sortable: true,
          visible: true
        }, {
          key: 'status',
          name: 'Status',
          width: 100,
          filterable: true,
          sortable: true,
          visible: true
        }, {
          key: 'timestamp',
          name: 'Erstellt am',
          width: 80,
          filterable: true,
          sortable: true,
          visible: true
        }, {
          key: 'firstName',
          name: 'Vorname',
          width: 100,
          filterable: true,
          sortable: true,
          visible: true
        }, {
          key: 'lastName',
          name: 'Nachname',
          width: 100,
          filterable: true,
          sortable: true,
          visible: true
        }, {
          key: 'company',
          name: 'Unternehmen',
          width: 100,
          filterable: true,
          sortable: true,
          visible: true
        }, {
          key: 'paymentType',
          name: 'Zahlungsart',
          width: 80,
          filterable: true,
          sortable: true,
          visible: true
        }, {
          key: 'details',
          name: 'Details',
          width: 50,
          filterable: false,
          sortable: false,
          visible: true
        }, {
          key: 'receiptable',
          name: 'Quittung',
          width: 60,
          filterable: false,
          sortable: false,
          visible: true
        }, {
          key: 'stateChange',
          name: 'Status wechseln',
          width: 120,
          filterable: false,
          sortable: false,
          visible: true
        }, {
          key: 'sendReceipt',
          name: 'Quittung',
          width: 139,
          filterable: false,
          sortable: false,
          visible: true
        }, {
          key: 'timeStampValue',
          visible: false
        }
      ],
      rows: [],
      filters: {},
      restConfig: getConfig(),
      cartDetails: {},
      selectedCartStates: [
        {value: 'CALLBACK', label: 'Callback'}
      ],
      cartRequest: {
        cartStates: [
          'CALLBACK'
        ],
        from: 0,
        to: 0
      },
      selectedIndexes: []
    };
  }

  componentDidMount() {
    let to = new Date();
    let from;
    if(to.getMonth() < 3){
        from = new Date(to.getFullYear() - 1, 12 - (3 - to.getMonth()));
    }else{
      from = new Date(to.getFullYear(), to.getMonth() - 2);
    }
    this.state.cartRequest.from = from.getTime();
    this.state.cartRequest.to = to.getTime();
    this.forceUpdate();
    this.loadCarts();
  }

  loadCarts() {
    this.refs['spinner'].showSpinner();
    var that = this;
    axios.post('http://localhost:8083/carts',this.state.cartRequest ,this.state.restConfig).then(function(response) {
      var result = response.data;
      var rows = that.createRows(result);
      that.setState({carts: result, rows: rows});
      that.refs['spinner'].hideSpinner();
    }).catch(function(response) {
      that.refs.notification.addNotification('Fehler beim Laden der Pflanzkörbe!', response.data, 'error');
      that.refs['spinner'].hideSpinner();
    });
  }

  getCartDetails(id, event) {
    var that = this;
    var x = event.pageX;
    var y = event.pageY;
    axios.get('http://localhost:8083/cart/' + id, this.state.restConfig).then(function(response) {
      var result = response.data;
      that.setState({cartDetails: result, x: x, y: y  });
    }).catch(function(response) {
      that.refs.notification.addNotification('Fehler beim Laden des Pflanzkorbes ' + id + '!', response.data, 'error');
    });
  }

  hideCartDetails(event){
    this.setState({cartDetails: {} });
  }

  createRows(carts) {
    var rows = [];
    for (var cart in carts) {
      var row = this.createRow(carts[cart]);
      rows.push(row);
    }
    return rows;
  }

  createRow(cart) {
    var row = {
      id: cart.id,
      user: cart.buyer ? cart.buyer.name : '',
      price: Accounting.formatNumber(cart.totalPrice, 2, '.', ','),
      status: cart.cartState,
      timestamp: moment(cart.timeStamp).format('DD.MM.YYYY'),
      firstName: cart.callBackVorname,
      lastName: cart.callBackNachname,
      company: cart.callBackFirma,
      paymentType: cart.callBackZahlungsart,
      details: this.createDetailIcon(cart.id),
      receiptable: this.createReceiptCheckbox(cart.id, cart.receiptable, cart.receipt),
      stateChange: this.createStateChangeDropdown(cart.id),
      sendReceipt: cart.buyer ? this.createSendReceiptButton(cart.buyer.id, cart.receipt) : '',
      timeStampValue: cart.timeStamp
    };
    return row;
  }

  createSendReceiptButton(userId, receipt) {
    if(receipt && receipt._receiptId){
      return <div><IconButton text="" glyphIcon="glyphicon-envelope" onClick={() => this.sendReceipt(userId, receipt._receiptId)}/></div>;
    }else{
      return <div></div>;
    }
  }

  sendReceipt(userId, receiptId){
    var that = this;
    axios.post('http://localhost:8081/receipt/send?userId=' + userId + '&receiptId=' + receiptId, {}, this.state.restConfig).then(function(response) {
      that.refs.notification.addNotification("Mail versandt!", "Die Quittung wurde an den User verschickt!", "success");
    }).catch(function(response) {
      that.refs.notification.addNotification('Es ist ein Fehler aufgetreten!', 'Beim Umsetzen des Quittungsflags vom Pflanzkorb mit der ID ' + id + 'auf ' + value + ' ist folgender Fehler aufgetreten:' + response.data, 'error');
    });
  }

  createReceiptCheckbox(id, value, receipt){
    return <div className="align-center"><input type="checkbox" checked={value} onChange={(event) => this.changeReceiptableFlag(id, event, receipt)} disabled={receipt}/></div>;
  }

  changeReceiptableFlag(id, event, receipt){
    let value = event.target.checked;
    var that = this;
    axios.post('http://localhost:8083/cart/receiptable?cartId=' + id + '&receiptable=' + value, {}, this.state.restConfig).then(function(response) {
      for (var cart in that.state.carts) {
        if (that.state.carts[cart].id == id) {
          that.state.carts[cart].receiptable = value;
          break;
        }
      }
      for (var row in that.state.rows) {
        if (that.state.rows[row].id == id) {
          that.state.rows[row].receiptable = that.createReceiptCheckbox(id, value, receipt);
          break;
        }
      }
      that.forceUpdate();
    }).catch(function(response) {
      that.refs.notification.addNotification('Es ist ein Fehler aufgetreten!', 'Beim Umsetzen des Quittungsflags vom Pflanzkorb mit der ID ' + id + 'auf ' + value + ' ist folgender Fehler aufgetreten:' + response.data, 'error');
    });
  }

  createDetailIcon(id) {
    return <div className="edit-icon">
      <span className="glyphicon glyphicon-list-alt" aria-hidden="true" onMouseOver={(event) => {
        this.getCartDetails(id, event);
      }} onMouseLeave={(event) => {
        this.hideCartDetails( event);
      }}></span>
    </div>;
  }

  createStateChangeDropdown(id) {
    return <div>
            <select onChange={(event) => this.changeStatusOfCart(id, event)}>
              <option></option>
              <option value="CALLBACK">CALLBACK</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="DISCARDED">DISCARDED</option>
            </select>
          </div>;
  }

  changeStatusOfCart(id, event) {
    let cartState = event.target.value;
    if(cartState != 'DISCARDED'){
      this.callSatusRequest(id, cartState)
    }else{
      this.createDiscardConfirmation(id);
    }
  }

  callSatusRequest(id, cartState) {
    var that = this;
    var config = getConfig();
    axios.post('http://localhost:8083/cart/changeState?cartId=' + id + '&cartState=' + cartState, {}, config).then(function(response) {
      for (var cart in that.state.carts) {
        if (that.state.carts[cart].id == id) {
          that.state.carts[cart].cartState = cartState;
          break;
        }
      }
      for (var row in that.state.rows) {
        if (that.state.rows[row].id == id) {
          that.state.rows[row].status = cartState;
          break;
        }
      }
      that.forceUpdate();
    }).catch(function(response) {
      that.refs.notification.addNotification('Es ist ein Fehler aufgetreten!', 'Beim Umsetzen des Status vom Pflanzkorb mit der ID ' + id + 'auf ' + cartState + ' ist folgender Fehler aufgetreten:' + response.data, 'error');
    });
  }

  createDiscardConfirmation(id) {
    this.refs.notificationSystem.addNotification({
      title: 'Achtung!',
      position: 'tc',
      autoDismiss: 0,
      message: 'Dadurch werden die Bäume zu diesem Pflanzkorb entfernt! Diese Aktion kann nicht rückgängig gemacht werden!',
      level: 'warning',
      children: (
        <div className="delete-confirmation align-center">
        <button>Abbrechen</button>
        <button onClick={() => {
          this.callSatusRequest(id, 'DISCARDED');
        }}>OK</button>
      </div>
      )
    });
  }

  getRows() {
    return Data.Selectors.getRows({rows: this.state.rows, filters: this.state.filters});
  }

  rowGetter(i) {
    var rows = this.getRows();
    return rows[i];
  }

  getSize() {
    return this.getRows().length;
  }

  handleFilterChange(filter) {
    var newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
    this.setState({filters: newFilters});
  }

  handleGridSort(sortColumn, sortDirection) {
    var sortedRows = this.state.rows;

    const comparer = (a, b) => {
      if(sortColumn == 'timestamp'){
        if (sortDirection === 'ASC') {
          return (a.timeStampValue > b.timeStampValue)
            ? 1
            : -1;
        } else if (sortDirection === 'DESC') {
          return (a.timeStampValue < b.timeStampValue)
            ? 1
            : -1;
        }
        return 1;
      }else{
        if (sortDirection === 'ASC') {
          return (a[sortColumn] > b[sortColumn])
            ? 1
            : -1;
        } else if (sortDirection === 'DESC') {
          return (a[sortColumn] < b[sortColumn])
            ? 1
            : -1;
        }
      }
    };

    const rows = sortDirection === 'NONE'
      ? ' '
      : sortedRows.sort(comparer);

    this.setState({rows : sortedRows});
  }

  sortByDateString(){

  }

  onClearFilters() {
    this.setState({filters: {}});
  }

  getEmptyRowView() {
    return (
      <div>Nothing to show</div>
    );
  }

  handleStateSelection(objects) {
    let states = [];
    if (null != objects) {
      for(let elm of objects) {
        states.push(elm.value);
      }
    }
    this.state.selectedCartStates = objects;
    this.state.cartRequest.cartStates = states;
    this.forceUpdate();
  }

  updateFrom(value){
    if (value) {
      this.state.cartRequest.from = Date.parse(value);
    } else {
      this.state.cartRequest.from = 0;
    }
    this.forceUpdate();
  }

  updateTo(value) {
    if (value) {
      this.state.cartRequest.to = Date.parse(value);
    } else {
      this.state.cartRequest.to = new Date().getTime();
    }
    this.forceUpdate();
  }

  render() {
    var style = {
      Containers: {
        DefaultStyle: {
          zIndex: 11000
        },
        tc: {
          top: '50%',
          bottom: 'auto',
          margin: '0 auto',
          left: '50%'
        }
      }
    };

    const cols = this.state.columns.filter(column => column.visible === true);
    let selectedOption = 'one';

    return (
      <div className="container paddingTopBottom15 cartOverview">
        <div className="row ">
          <div className="col-md-12">
            <h1>Carts</h1>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="status">Stati:</label>
              <Select id="status"
                 name="form-field-name"
                 value={this.state.selectedCartStates}
                 onChange={this.handleStateSelection.bind(this)}
                 isMulti={true}
                 options={[
                   { value: 'VERIFIED', label: 'Verified' },
                   { value: 'CALLBACK', label: 'Callback' },
                   { value: 'INITIAL', label: 'Initial' },
                   { value: 'DISCARDED', label: 'Discarded' },
                   { value: 'GENERATED', label: 'Generated' },
                 ]} />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="from">Von:</label>
              <DatePicker value={new Date(this.state.cartRequest.from).toISOString()} onChange={this.updateFrom.bind(this)} dateFormat="DD.MM.YYYY" calendarPlacement="right"/>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="to">Bis:</label>
              <DatePicker value={new Date(this.state.cartRequest.to).toISOString()} onChange={this.updateTo.bind(this)} dateFormat="DD.MM.YYYY" calendarPlacement="right"/>
            </div>
          </div>
          <div className="col-md-3">
            <IconButton text="Lade Pflanzkörbe" glyphIcon="glyphicon-refresh" onClick={this.loadCarts.bind(this)}/>
            <br/>
            <br/>
            <label >Ergebnisse:</label>&nbsp;{this.state.carts.length}
          </div>
        </div>
        <div className="row ">
          <div className="col-md-12">
            <ReactDataGrid
              columns={cols}
              rowGetter={this.rowGetter.bind(this)}
              rowsCount={this.getSize()}
              onGridSort={this.handleGridSort.bind(this)}
              minHeight={800}
              onAddFilter={this.handleFilterChange.bind(this)}
              onClearFilters={this.onClearFilters.bind(this)}
              emptyRowsView={this.getEmptyRowView.bind(this)}
            />
          </div>
        </div>
        <CartDetails details={this.state.cartDetails} x={this.state.x} y={this.state.y}/>
        <LoadingSpinner ref="spinner"/>
        <NotificationSystem ref="notificationSystem" style={style}/>
        <Notification ref="notification"/>
      </div>
    );
  }
}
