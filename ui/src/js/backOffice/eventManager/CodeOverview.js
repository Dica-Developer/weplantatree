import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import {
  browserHistory
} from 'react-router';

import ReactDataGrid from 'react-data-grid';
import {
  Toolbar,
  Data
} from 'react-data-grid-addons';

import IconButton from '../../common/components/IconButton';
import Notification from '../../common/components/Notification';
import {
  getConfig
} from '../../common/RestHelper';

export default class CodeOverview extends Component {

  constructor() {
    super();
    this.state = {
      codes: [],
      titles: ['ID', 'Code', 'Cart-Status'],
      columns: [{
        key: 'id',
        name: 'ID',
        width: 60,
        filterable: true,
        sortable: true
      }, {
        key: 'code',
        name: 'Code',
        width: 300,
        filterable: true,
        sortable: true
      }, {
        key: 'cartstatus',
        name: 'Cart-Status',
        width: 300,
        filterable: true,
        sortable: true
      }],
      rows: [],
      filters: {}
    };
  }

  componentDidMount() {
    this.setCodesAndCreateRows(this.props.codes);
  }

  setCodesAndCreateRows(codes) {
    var rows = this.createRows(codes);
    this.setState({
      codes: codes,
      rows: rows
    });
  }

  // ///////////////////////// ROW-FUNCTIONS ///////////////////////////////
  createRows(codes) {
    var rows = [];
    for (var code in codes) {
      var row = this.createRow(codes[code]);
      rows.push(row);
    }
    return rows;
  }

  createRow(code) {
    var cartState = '';
    if (code.cart != null) {
      cartState = code.cart.cartState;
    } else {
      cartState = 'NO CART GENERATED!';
    };
    var row = {
      id: code.id,
      code: code.code,
      cartstatus: cartState
    };

    return row;
  }

  getRows() {
    return Data.Selectors.getRows({
      rows: this.state.rows,
      filters: this.state.filters
    });
  }

  rowGetter(i) {
    var rows = this.getRows();
    return rows[i];
  }

  // ///////////////////////// END OF ROW-FUNCTIONS ///////////////////////////////

  // ///////////////////////// TABLE-FUNCTIONS ///////////////////////////////
  getSize() {
    return this.getRows().length;
  }

  handleGridSort(sortColumn, sortDirection) {
    var sortedRows = this.state.rows;
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ?
          1 :
          -1;
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ?
          1 :
          -1;
      }
    };

    const rows = sortDirection === 'NONE' ?
      ' ' :
      sortedRows.sort(comparer);

    this.setState({rows: sortedRows});
  }

  getEmptyRowView() {
    return (
      <div>Nothing to show</div>
    );
  }
  // ///////////////////////// END OF TABLE-FUNCTIONS ///////////////////////////////

  // ///////////////////////// FILTER-FUNCTIONS ///////////////////////////////
  handleFilterChange(filter) {
    var newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
    this.setState({
      filters: newFilters
    });
  }

  onClearFilters() {
    this.setState({
      filters: {}
    });
  }

  // ///////////////////////// END OF FILTER-FUNCTIONS ///////////////////////////////

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
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <h3>Code-Übersicht</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <ReactDataGrid columns={this.state.columns} titles={this.state.titles} rowGetter={this.rowGetter.bind(this)} rowsCount={this.getSize()} onGridSort={this.handleGridSort.bind(this)} minHeight={800} toolbar={< Toolbar enableFilter = {
              true
            } />} onAddFilter={this.handleFilterChange.bind(this)} onClearFilters={this.onClearFilters.bind(this)} emptyRowsView={this.getEmptyRowView.bind(this)}/>
          </div>
          <Notification ref="notification"/>
        </div>
      </div>
    );
  }
}
