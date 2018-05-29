import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import {browserHistory} from 'react-router';
import ReactDataGrid from 'react-data-grid';
import {Toolbar, Data} from 'react-data-grid-addons';

import IconButton from '../../common/components/IconButton';
import NotificationSystem from 'react-notification-system';
import {getConfig} from '../../common/RestHelper';

export default class ArticleOverview extends Component {

  constructor() {
    super();
    this.state = {
      articles: [],
      columns: [
        {
          key: 'id',
          name: 'ID',
          width: 40,
          filterable: true
        }, {
          key: 'title',
          name: 'Titel',
          width: 585,
          filterable: true
        }, {
          key: 'type',
          name: 'Typ',
          width: 150,
          filterable: true
        }, {
          key: 'owner',
          name: 'Erstellt von',
          width: 120,
          filterable: true
        }, {
          key: 'edit',
          name: '',
          width: 40,
          filterable: false
        }, {
          key: 'delete',
          name: '',
          width: 40,
          filterable: false
        }
      ],
      rows: [],
      filters: {}
    };
  }

  componentDidMount() {
    this.loadArticles();
  }

  loadArticles() {
    var that = this;
    var restConfig = getConfig();
    axios.get('http://localhost:8082/backOffice/articles', restConfig).then(function(response) {
      var result = response.data;
      var rows = that.createRows(result);
      that.setState({articles: result, rows: rows});
    }).catch(function(response) {
      if (response instanceof Error) {
        console.error('Error', response.message);
      } else {
        console.error(response.data);
        console.error(response.status);
        console.error(response.headers);
        console.error(response.config);
      }
    });

  }

  createRows(articles) {
    var rows = [];

    for (var article in articles) {
      var id = articles[article].id;
      var row = this.createRow(articles[article]);
      rows.push(row);
    }
    return rows;
  }

  createRow(article) {
    var row = {
      id: article.id,
      type: article.articleType,
      title: article.title,
      owner: article.owner.name,
      edit: <IconButton glyphIcon="glyphicon-pencil" text="" onClick={() => {
        this.edit(article.id);
      }}/>,
      delete: this.createDeleteButton(article.id),
      isScrolling: false
    };
    return row;
  }

  createDeleteButton(id) {
    return <IconButton glyphIcon="glyphicon-trash" text="" onClick={() => {
      this.createDeleteConfirmation(id);
    }}/>;
  }

  edit(id) {
    browserHistory.push('article-edit/' + id);
  }

  createDeleteConfirmation(id) {
    this.refs.notificationSystem.addNotification({
      title: 'Achtung!',
      position: 'tc',
      autoDismiss: 0,
      message: 'Artikel mit ID ' + id + ' wird gelöscht!',
      level: 'warning',
      children: (
        <div className="delete-confirmation align-center">
          <button>Abbrechen</button>
          <button onClick={() => {
            this.delete(id);
          }}>OK</button>
        </div>
      )
    });
  }

  delete(id) {
    var that = this;
    var restConfig = getConfig();
    axios.delete('http://localhost:8082/backOffice/article?articleId=' + id, restConfig).then(function(response) {
      that.loadArticles();
      that.refs.notificationSystem.addNotification({
        title: 'geschafft!',
        position: 'tc',
        autoDismiss: 0,
        message: 'artikel mit id ' + id + ' wurde gelöscht!',
        level: 'success'
      });

    }).catch(function(response) {
      if (response instanceof Error) {
        console.error('Error', response.message);
      } else {
        console.error(response.data);
        console.error(response.status);
        console.error(response.headers);
        console.error(response.config);
      }
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
    return (
      <div>
        <div className="row ">
          <div className="col-md-12">
            <h3>Artikel-Übersicht</h3>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-12">
            <ReactDataGrid columns={this.state.columns} rowGetter={this.rowGetter.bind(this)} rowsCount={this.getSize()} minHeight={800} toolbar={< Toolbar enableFilter = {
              true
            } />} onAddFilter={this.handleFilterChange.bind(this)} onClearFilters={this.onClearFilters.bind(this)} emptyRowsView={this.getEmptyRowView.bind(this)}/>
          </div>
        </div>
        <NotificationSystem ref="notificationSystem" style={style}/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
