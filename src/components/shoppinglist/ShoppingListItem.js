import React, { Component } from 'react'
import {
  Button,
  ListGroupItem } from 'reactstrap'
import API from '../../modules/data/API';
import BoughtIngredientModal from './BoughtIngredientModal';
import user from '../../modules/data/user';

class ShoppingListItem extends Component {

  boughtItem = (item) => {
    let userProductsObj = {
      userId: item.userId,
      productId: item.productId,
      amountAvailable: item.product.fullAmount
    }
    //add item to userProducts and delete from userShopping
    return API.saveData("userProducts", userProductsObj)
      .then(() => this.props.deleteItem(item.id))
  }

  boughtIngredientProduct = (product, item) => {
    let userProductsObj = {
      userId: user.getId(),
      productId: product.id,
      amountAvailable: product.fullAmount
    }
    return API.saveData("userProducts", userProductsObj)
      .then(() => this.props.deleteItem(item.id))
  }

  render() {
    let item = this.props.item
    return (
      <ListGroupItem className="mb-2 d-flex" id={item.id}>
        <div>{item.productId ? `Product: ${item.product.name}` : `Ingredient: ${item.ingredient.label}`}</div>
        <div className="ml-auto">
          { item.productId
            ? <Button className="btn-sm ml-2" onClick={() => this.boughtItem(item)}>Bought</Button>
            : <BoughtIngredientModal
                buttonLabel="Bought"
                ingredient={this.props.item.ingredient}
                boughtIngredientProduct={this.boughtIngredientProduct}
                item={item} />
          }
          <Button className="btn-sm ml-2" onClick={() => this.props.deleteItem(item.id)}>Delete</Button>
        </div>
      </ListGroupItem>
    )
  }

}

export default ShoppingListItem