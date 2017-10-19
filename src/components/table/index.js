import React, { Component } from 'react';


class Table extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
      data: this.emptyGrid(),
      active_cell: [-1, -1]
    }
    
    window.table = this
  }

  emptyRow = (length) =>{
    length = length || this.props.fields.length
    return Array(length).fill('')
  }

  emptyGrid = (height,width) =>  {
    height = height || this.props.rows 
    width = width || this.props.fields.length
    return this.emptyRow(height).map(()=> this.emptyRow(width))
  }
    
  get_data = () => {
    let fields = this.props.fields
    return JSON.stringify(
      this.state.data.map((row, index) => {
        let hash = {}
        row.map((cell, index) => {
          let key = fields[index] 
          hash[key] = cell || null
          return cell
        })
        return hash
      })
    )
  }

  add_row = (row_after_index) => {
    this.setState((prevState) => {
      let current_data = prevState.data
      current_data.splice(row_after_index, 0, this.emptyRow())
      return {
        data: current_data
      }
    })
  }

  clean_table = () => {
    this.setState({ data: this.emptyGrid(this.state.data.length) })
  }

  changeCell = (row, column, value) => {
    let data = this.state.data
    data[row][column] = value
    this.setState({data: data});

  }

  checkActive = (row, column) => {
    return this.state.active_cell.toString() === [row, column].toString()
  }

  selectCell = (row, column) => {
    this.setState({ active_cell: [row, column] })
  }

  headers = this.props.fields.map((header, index) =>
    <th key={index} >{header}</th>
  )

  rows = (() =>
    this.state.data.map((row, row_index) =>
      <tr key={row_index}>
        {
          row.map((value, column) =>
            <Cell
              key={column}
              column={column}
              row={row_index}
              selected={this.checkActive(row_index, column)}
              data={value}
              changeValue={this.changeCell}
              selectCell={this.selectCell}
            />
          )
        }
      </tr>
    )
  )


  render() {
    return (
      <table className={'table table-bordered ' + this.props.meta}>
        <thead>
          <tr>
            {this.headers}
          </tr>
        </thead>
        <tbody>
          {this.rows()}
        </tbody>
      </table>
    )
  }

}

class Cell extends Component {

  constructor(props) {
    super(props)
    this.state = { content: props.data  }
  }


  select = () => {
    this.props.selectCell(this.props.row, this.props.column)
  }

  deselect = () => {
    this.props.selectCell(-1, -1)
  }

  detectEnter = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.deselect();
      this.changeValue();
    }
  }

  edit = (e) => {
    this.setState({ content: e.target.value })
  }

  changeValue = () => {
    this.props.changeValue(this.props.row, this.props.column, this.state.content)

  }

  render() {
    let cellContent = this.props.selected ?
      <input onChange={this.edit}
        onBlur={this.changeValue}
        onKeyDown={this.detectEnter}
        size={1}
        value={this.state.content} /> :
      <span>{this.props.data}</span>

    return (<td onDoubleClick={this.select} >{cellContent}</td>)
  }

}

export default Table;