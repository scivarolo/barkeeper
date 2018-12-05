import React, { Component } from 'react'
import {
  Button,
  ListGroupItem } from 'reactstrap'

class ShoppingListItem extends Component {

  render() {
    let item = this.props.item
    return (
      <ListGroupItem className="mb-2" id={item.id}>
        <div>{item.product.name}</div>
        <div>
          <Button className="btn-sm ml-2" onClick={() => this.props.deleteItem(item.id)}>Delete</Button>
        </div>
      </ListGroupItem>
    )
  }

}

export default ShoppingListItem