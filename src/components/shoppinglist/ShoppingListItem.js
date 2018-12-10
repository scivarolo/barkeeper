import React, { Component } from 'react'
import {
  Button,
  ListGroupItem } from 'reactstrap'
import API from '../../modules/data/API';
import BoughtIngredientModal from './boughtIngredient/BoughtIngredientModal';
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

  increaseQuantity = () => {
    return API.editData("userShopping", this.props.item.id, {
      quantity: this.props.item.quantity + 1
    }).then(() => this.props.getShoppingData())
  }

  decreaseQuantity = () => {
    if (this.props.item.quantity === 1) {
      return this.props.deleteItem(this.props.item.id)
    } else {
      return API.editData("userShopping", this.props.item.id, {
        quantity: this.props.item.quantity - 1
      }).then(() => this.props.getShoppingData())
    }
  }

  render() {
    let item = this.props.item
    return (
      <ListGroupItem className="mb-2 d-flex" id={item.id}>
        <div>
          <h6>{item.productId ? `Product: ${item.product.name}` : `Ingredient: ${item.ingredient.label}`}</h6>
          <p>Quantity: {item.quantity}
            <i onClick={this.decreaseQuantity} className="icon-minus icons mx-1"></i>
            <i onClick={this.increaseQuantity} className="icon-plus icons mx-1"></i>
          </p>
        </div>
        <div className="ml-auto">
          { item.productId
            ? <Button className="btn-sm ml-2" onClick={() => this.boughtItem(item)}>Bought</Button>
            : <BoughtIngredientModal
                buttonLabel="Bought"
                ingredient={this.props.item.ingredient}
                boughtIngredientProduct={this.boughtIngredientProduct}
                item={item}
                deleteItem={this.props.deleteItem} />
          }
          <Button className="btn-sm ml-2" onClick={() => this.props.deleteItem(item.id)}>Delete</Button>
        </div>
      </ListGroupItem>
    )
  }

}

export default ShoppingListItem