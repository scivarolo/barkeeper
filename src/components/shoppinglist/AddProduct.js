/**
 * Form for adding a product to the shopping list.
 */

import React, { Component } from "react"
import PropTypes from "prop-types"
import {
  Button,
  InputGroupAddon } from "reactstrap"
import { Typeahead } from "react-bootstrap-typeahead"
import "react-bootstrap-typeahead/css/Typeahead.css"
import "react-bootstrap-typeahead/css/Typeahead-bs4.css"
import API from "../../modules/data/data"

class AddProduct extends Component {

  state = {
    products: [],
    selected: []
  }

  loadProducts() {
    return API.getAll("products")
      .then(products => this.setState({products: products}))
  }

  addDropdownProducts = () => {
    if (!this.state.selected.length) return

    // Save products to the shopping list
    let products = this.state.selected

    let savePromises = products.map(product => {
      let haveProduct = this.props.shoppingList.find(shopProduct => shopProduct.product_id === product.id)
      if (haveProduct) {
        return API.edit("user_shopping", haveProduct.id, {
          quantity: haveProduct.quantity + 1
        })
      } else {
        return API.save("user_shopping", {
          product_id: product.id,
          ingredient_id: null,
          quantity: 1
        })
      }
    })
    return Promise.all(savePromises)
      .then(() => {
        let products = this.state.selected.map(product => product.name)
        this.props.toggleAlert("success", "Product(s) Added to Shopping List", `${products.join(" & ")} successfully added.`)
      })
      .then(() => this.setState({selected: []}))
      .then(() => this.props.getShoppingData())
      .then(() => this.props.toggle())
  }

  componentDidMount() {
    this.loadProducts()
  }

  render() {
    if(this.props.show) {
      return (
        <>
          <Typeahead
            labelKey="name"
            multiple={true}
            options={this.state.products}
            placeholder="Search for products"
            onChange={selected => this.setState({selected: selected})} />
          <InputGroupAddon addonType="append">
            <Button onClick={this.addDropdownProducts}>Add</Button>
          </InputGroupAddon>
        </>
      )
    } else {
      return null
    }
  }

}

export default AddProduct

AddProduct.displayName = "AddProduct"
AddProduct.propTypes = {
  shoppingList: PropTypes.array.isRequired,
  toggleAlert: PropTypes.func.isRequired,
  getShoppingData: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
}