import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import Accounting from 'accounting';
import {browserHistory} from 'react-router';
import moment from 'moment';
import ReactDataGrid from 'react-data-grid';
import {Toolbar, Data} from 'react-data-grid-addons';

import IconButton from '../../common/components/IconButton';
import NotificationSystem from 'react-notification-system';
import Notification from '../../common/components/Notification';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import {getConfig} from '../../common/RestHelper';
import {getTextForSelectedLanguage} from '../../common/language/LanguageHelper';

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
          width: 90,
          filterable: true,
          sortable: true,
          visible: true
        }, {
          key: 'status',
          name: 'Status',
          width: 120,
          filterable: true,
          sortable: true,
          visible: true
        }, {
          key: 'timestamp',
          name: 'Erstellt am',
          width: 100,
          filterable: true,
          sortable: true,
          visible: true
        }, {
          key: 'firstName',
          name: 'Vorname',
          width: 150,
          filterable: true,
          sortable: true,
          visible: true
        }, {
          key: 'lastName',
          name: 'Nachname',
          width: 150,
          filterable: true,
          sortable: true,
          visible: true
        }, {
          key: 'company',
          name: 'Unternehmen',
          width: 200,
          filterable: true,
          sortable: true,
          visible: true
        }, {
          key: 'paymentType',
          name: 'Zahlungsart',
          width: 40,
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
          key: 'stateChange',
          name: 'Actions',
          width: 100,
          filterable: false,
          sortable: false,
          visible: true
        }
      ],
      rows: [],
      filters: {},
      restConfig: getConfig(),
      cartDetails: {}
    };
  }

  componentDidMount() {
    this.loadCarts();
  }

  loadCarts() {
    this.refs['spinner'].showSpinner();
    var that = this;
    axios.get('http://localhost:8083/carts', this.state.restConfig).then(function(response) {
      var result = response.data;
      var rows = that.createRows(result);
      that.setState({carts: result, rows: rows});
      that.refs['spinner'].hideSpinner();
    }).catch(function(response) {
      that.refs.notification.addNotification('Fehler beim Laden der Pflanzkörbe!', response.data, 'error');
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
    var user = cart.buyer == null
      ? ''
      : cart.buyer.name;
    var row = {
      id: cart.id,
      user: user,
      price: Accounting.formatNumber(cart.totalPrice, 2, '.', ','),
      status: cart.cartState,
      timestamp: moment(cart.timeStamp).format('DD.MM.YYYY'),
      firstName: cart.callBackVorname,
      lastName: cart.callBackNachname,
      company: cart.callBackFirma,
      paymentType: cart.callBackZahlungsart,
      details: this.createDetailIcon(cart.id),
      stateChange: this.createStateChangeButtons(cart.id, cart.cartState)
    };
    return row;
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

  createStateChangeButtons(id, cartState) {
    if (cartState == 'CALLBACK') {
      return <div className="state-change-buttons">
        <IconButton glyphIcon="glyphicon-ok" text="" onClick={() => {
          this.changeStatusOfCart(id, 'VERIFIED');
        }}/>
        <IconButton glyphIcon="glyphicon-remove" text="" onClick={() => {
          this.createDiscardConfirmation(id);
        }}/>
      </div>;
    } else if (cartState == 'VERIFIED') {
      return <div className="state-change-buttons">
        <IconButton glyphIcon="glyphicon-remove" text="" onClick={() => {
          this.createDiscardConfirmation(id);
        }}/>
      </div>;
    }
  }

  createDiscardConfirmation(id) {
    this.refs.notificationSystem.addNotification({
      title: 'Achtung!',
      position: 'tc',
      autoDismiss: 0,
      message: 'Dadurch werden die darin enthaltenen Bäume gelöscht!',
      level: 'warning',
      children: (
        <div className="delete-confirmation align-center">
          <button>Abbrechen</button>
          <button onClick={() => {
            this.changeStatusOfCart(id, 'DISCARDED');
          }}>OK</button>
        </div>
      )
    });
  }

  changeStatusOfCart(id, cartState) {
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
          that.state.rows[row].stateChange = that.createStateChangeButtons(id, cartState);
          break;
        }
      }
      that.forceUpdate();
    }).catch(function(response) {
      that.refs.notification.addNotification('Es ist ein Fehler aufgetreten!', 'Beim Umsetzen des Status vom Pflanzkorb mit der ID ' + id + 'auf ' + cartState + ' ist folgender Fehler aufgetreten:' + response.data, 'error');
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
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn])
          ? 1
          : -1;
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn])
          ? 1
          : -1;
      }
    };

    const rows = sortDirection === 'NONE'
      ? ' '
      : sortedRows.sort(comparer);

    this.setState({rows : sortedRows});
  }

  onClearFilters() {
    this.setState({filters: {}});
  }

  getEmptyRowView() {
    return (
      <div>Nothing to show</div>
    );
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

    return (
      <div className="container paddingTopBottom15 cartOverview">
        <div className="row ">
          <div className="col-md-12">
            <h1>Carts</h1>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-12">
            <ReactDataGrid columns={cols} rowGetter={this.rowGetter.bind(this)} rowsCount={this.getSize()} onGridSort={this.handleGridSort.bind(this)} minHeight={800} toolbar={< Toolbar enableFilter = {
              true
            } />} onAddFilter={this.handleFilterChange.bind(this)} onClearFilters={this.onClearFilters.bind(this)} emptyRowsView={this.getEmptyRowView.bind(this)}/>
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
