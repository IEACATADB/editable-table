import React, { Component } from 'react';

import Table  from './components/table';


class App extends Component {
  fields = ['header', 'header2', 'header3', 'header4', 'header5']
  rows = 4
  meta = ''

  render() {
    return (
      <div className="App">

        <Table fields={this.fields} rows={this.rows} className={'table'} meta={this.meta} />
      </div>
    );
  }
}


export default App;
