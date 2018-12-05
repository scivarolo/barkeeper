import React, { Component } from 'react'
import {
  Button,
  ListGroupItem } from 'reactstrap'
import API from '../../modules/data/API';

class ShoppingListItem extends Component {

  boughtItem = (item) => {
    //console.log("bought item", item)
    let userProductsObj = {
      userId: item.userId,
      productId: item.productId,
      amountAvailable: item.product.fullAmount
    }
    // console.log("to inventory", userProductsObj)
    //add item to userProducts
    return API.saveData("userProducts", userProductsObj)
      .then(() => this.props.deleteItem(item.id))

    //remove item from userShopping
    //using this.props.deleteItem
  }

  render() {
    let item = this.props.item
    return (
      <ListGroupItem className="mb-2 d-flex" id={item.id}>
        <div>{item.product.name}</div>
        <div className="ml-auto">
          <Button className="btn-sm ml-2" onClick={() => this.boughtItem(item)}>Bought</Button>
          <Button className="btn-sm ml-2" onClick={() => this.props.deleteItem(item.id)}>Delete</Button>
        </div>
      </ListGroupItem>
    )
  }

}

export default ShoppingListItem