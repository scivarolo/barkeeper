import React, { Component } from 'react'
import {
  Button,
  ListGroupItem } from 'reactstrap'
// import API from '../../modules/data/API';

class BarItem extends Component {

  render() {
    let item = this.props.item
    return (
      <ListGroupItem className="mb-2" id={item.id}>
        <h4>{item.product.name}</h4>
        <p>Available: {item.amountAvailable}{item.product.unit}</p>
        <Button onClick={() => this.props.deleteItem(item.id)}>Delete</Button>
      </ListGroupItem>
    )
  }

}

export default BarItem