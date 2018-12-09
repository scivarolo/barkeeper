import React, { Component } from 'react'
import {
  Button,
  ListGroupItem } from 'reactstrap'
import API from '../../modules/data/API';

class ShoppingListItem extends Component {

  boughtItem = (item) => {
    if(item.productId) {
      let userProductsObj = {
        userId: item.userId,
        productId: item.productId,
        amountAvailable: item.product.fullAmount
      }
      //add item to userProducts and delete from userShopping
      return API.saveData("userProducts", userProductsObj)
        .then(() => this.props.deleteItem(item.id))
    }
  }

  render() {
    let item = this.props.item
    return (
      <ListGroupItem className="mb-2 d-flex" id={item.id}>
        <div>{item.productId ? `Product: ${item.product.name}` : `Ingredient: ${item.ingredient.label}`}</div>
        <div className="ml-auto">
          <Button className="btn-sm ml-2" onClick={() => this.boughtItem(item)}>Bought</Button>
          <Button className="btn-sm ml-2" onClick={() => this.props.deleteItem(item.id)}>Delete</Button>
        </div>
      </ListGroupItem>
    )
  }

}

export default ShoppingListItem