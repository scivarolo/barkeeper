import React, { Component } from 'react'
import {
  Button,
  ListGroupItem } from 'reactstrap'
import API from '../../modules/data/API';
import BoughtIngredientModal from './boughtIngredient/BoughtIngredientModal';
import user from '../../modules/data/user';
import QuantityToggles from '../utils/QuantityToggles';

class ShoppingListItem extends Component {

  // When 'bought' is clicked on a PRODUCT
  boughtProduct = (item) => {
    //check if product is already in user inventory
    return API.getWithFilters("userProducts", `productId=${item.productId}`, item.userId)
    .then(hasProduct => {
      if (hasProduct.length) {
        return API.editData("userProducts", hasProduct[0].id, {
          quantity: hasProduct[0].quantity + item.quantity
        }).then(() => this.props.deleteItem(item.id))
      } else {
        let userProductsObj = {
          userId: item.userId,
          productId: item.productId,
          amountAvailable: item.product.fullAmount,
          quantity: item.quantity
        }
        //add item to userProducts and delete from userShopping
        return API.saveData("userProducts", userProductsObj)
          .then(() => this.props.deleteItem(item.id))
      }
    })

  }

  //When 'bought' is clicked on an INGREDIENT, and an existing product is chosen
  boughtIngredientProduct = (product, item) => {

    return API.getWithFilters("userProducts", `productId=${product.id}`, item.userId)
    .then(hasProduct => {
      if(hasProduct.length) {
        return API.editData("userProducts", hasProduct[0].id, {
          quantity: hasProduct[0].quantity + item.quantity
        }).then(() => this.props.deleteItem(item.id))
      } else {
        let userProductsObj = {
          userId: item.userId,
          productId: product.id,
          amountAvailable: product.fullAmount,
          quantity: item.quantity
        }
        return API.saveData("userProducts", userProductsObj)
          .then(() => this.props.deleteItem(item.id))
      }
    })

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
            <QuantityToggles
              increase={this.increaseQuantity}
              decrease={this.decreaseQuantity} />
          </p>
        </div>
        <div className="ml-auto">
          { item.productId
            ? <Button className="btn-sm ml-2" onClick={() => this.boughtProduct(item)}>Bought</Button>
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