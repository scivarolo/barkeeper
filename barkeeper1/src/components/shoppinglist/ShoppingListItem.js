/**
 * Renders an individual shopping list item
 **/

import React, { Component } from "react"
import PropTypes from "prop-types"
import {
  Row,
  Col,
  Badge,
  ListGroupItem } from "reactstrap"
import API from "../../modules/data/data"
import BoughtIngredientModal from "./boughtIngredient/BoughtIngredientModal"
import QuantityToggles from "../utils/QuantityToggles"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

class ShoppingListItem extends Component {

  // When 'bought' is clicked on a PRODUCT
  boughtProduct = (item) => {
    //check if product is already in user inventory
    // return jsonAPI.getWithFilters("userProducts", `productId=${item.productId}`, item.userId)
    return API.getFiltered("user_products", `product=${item.product_id}`)
      .then(hasProduct => {
        if (hasProduct.length) {
          return API.edit("user_products", hasProduct[0].id, {
            quantity: hasProduct[0].quantity + item.quantity
          }).then(() => this.props.deleteItem(item.id))
        } else {
          let userProductsObj = {
            product_id: item.product_id,
            amount_available: item.product.size,
            quantity: item.quantity
          }
          //add item to userProducts and delete from userShopping
          return API.save("user_products", userProductsObj)
            .then(() => this.props.deleteItem(item.id))
        }
      })

  }

  //When 'bought' is clicked on an INGREDIENT, and an existing product is chosen
  boughtIngredientProduct = (product, item) => {

    return API.getFiltered("user_products", `product=${product.id}`)
      .then(hasProduct => {
        if(hasProduct.length) {
          return API.edit("user_products", hasProduct[0].id, {
            quantity: hasProduct[0].quantity + item.quantity
          }).then(() => this.props.deleteItem(item.id))
        } else {
          let userProductsObj = {
            product_id: product.id,
            amount_available: product.size,
            quantity: item.quantity
          }
          return API.save("user_products", userProductsObj)
            .then(() => this.props.deleteItem(item.id))
        }
      })

  }

  increaseQuantity = () => {
    return API.edit("user_shopping", this.props.item.id, {
      quantity: this.props.item.quantity + 1
    }).then(() => this.props.getShoppingData())
  }

  decreaseQuantity = () => {
    if (this.props.item.quantity === 1) {
      return this.props.deleteItem(this.props.item.id)
    } else {
      return API.edit("user_shopping", this.props.item.id, {
        quantity: this.props.item.quantity - 1
      }).then(() => this.props.getShoppingData())
    }
  }

  render() {
    let item = this.props.item
    return (
      <ListGroupItem className="mb-1 shopping-item" id={item.id}>
        <Row>
          <Col className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              {
                item.product_id
                  ? <>{item.product.name} <Badge className="ml-1 shopping-badge" color="primary">Product</Badge></>
                  : <>{item.ingredient.name} <Badge className="ml-1 shopping-badge" color="danger">Ingredient</Badge></>
              }
            </h5>
            <span className="d-flex ml-auto mr-2">
              <span>Quantity: {item.quantity}</span>
              <QuantityToggles
                increase={this.increaseQuantity}
                decrease={this.decreaseQuantity} />
            </span>
            <div className="shopping-utils">
              { item.product_id
                ? <FontAwesomeIcon icon="check" className="ml-2 shopping-bought"
                  onClick={() => {
                    this.boughtProduct(item)
                    this.props.toggleAlert("success", `${item.product.name} added to Inventory.`, "Go make a cocktail!")
                  }} />
                : <BoughtIngredientModal
                  buttonLabel="Bought"
                  ingredient={this.props.item.ingredient}
                  boughtIngredientProduct={this.boughtIngredientProduct}
                  item={item}
                  toggleAlert={this.props.toggleAlert}
                  deleteItem={this.props.deleteItem} />
              }
              <FontAwesomeIcon icon="trash" className="ml-2 shopping-remove"
                onClick={() => this.props.deleteItem(item.id)} />
            </div>
          </Col>

        </Row>
      </ListGroupItem>
    )
  }

}

export default ShoppingListItem

ShoppingListItem.displayName = "ShoppingListItem"
ShoppingListItem.propTypes = {
  deleteItem: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  getShoppingData: PropTypes.func.isRequired,
  toggleAlert: PropTypes.func.isRequired
}