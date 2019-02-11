/**
 * Handles Adding products to Bar Inventory.
 */

import React, { Component } from "react"
import {
  Button,
  InputGroupAddon } from "reactstrap"
import { Typeahead } from "react-bootstrap-typeahead"
import "react-bootstrap-typeahead/css/Typeahead.css"
import "react-bootstrap-typeahead/css/Typeahead-bs4.css"
import user from "../../modules/data/user"
import API from "../../modules/data/data"
import NewProduct from "../create/NewProduct"

class AddToBar extends Component {

  state = {
    allProducts: [],
    selected: [],
    showCreateNewProduct: false
  }

  // Load all products and set state.
  loadProducts = () => {
    return API.getAll("products")
      .then(products => this.setState({allProducts: products}))
  }

  // Selected products are added to the user's inventory
  addDropdownProducts = () => {

    if(!this.state.selected.length) return

    let userId = user.getId()
    let products = this.state.selected
    let savePromises = products.map(product => {
      let haveProduct = this.props.inventory.find(invProduct => invProduct.product.id === product.id)

      if (haveProduct) {
        return API.edit("user_products", haveProduct.id, {
          quantity: haveProduct.quantity + 1
        })
      }
      else {
        return API.save("user_products", {
          product_id: product.id,
          user: userId,
          quantity: 1,
          amount_available: this.state.allProducts.find(p => parseInt(p.id) === parseInt(product.id)).size
        })
      }
    })

    return Promise.all(savePromises)
      .then(() => this.props.getInventory())
      .then(() => {
        this.props.toggleAlert("success", "Products Added", `${this.state.selected.map(item => item.name)} successfully added to your bar inventory.`)
        this.setState({selected: []})
        this.props.toggle()
      })
      .catch(r => {
        console.error("Error saving Product", r)
      })
  }

  toggleCreateNewProduct = () => {
    this._typeahead.getInstance().clear()
    this.setState({showCreateNewProduct: !this.state.showCreateNewProduct, selected: []})
  }

  dropdownChange(selected) {
    this.setState({selected: selected})
    if(selected.length && selected[0].customOption) {
      //If new, Toggle create product inputs, and remove it from the typeahead
      this.toggleCreateNewProduct()
      selected = selected.splice(-1)
      this.setState({selected: selected})
    }
  }

  componentDidMount() {
    this.loadProducts()
  }

  render() {
    if(this.props.show) {
      return (
        <>
          <Typeahead
            allowNew
            newSelectionPrefix="New: "
            labelKey="name"
            options={this.state.allProducts.sort((a,b) => {
              let aName = a.name.toUpperCase()
              let bName = b.name.toUpperCase()
              return (aName < bName) ? -1 : (aName > bName) ? 1 : 0
            })}
            placeholder="Search for products"
            ref={(ref) => this._typeahead = ref}
            onChange={selected => this.dropdownChange(selected)} />
          <InputGroupAddon addonType="append">
            <Button onClick={this.addDropdownProducts}>Add</Button>
          </InputGroupAddon>
          {
            this.state.showCreateNewProduct
              ? <NewProduct
                product={this.state.selected[0]}
                toggle={this.toggleCreateNewProduct}
                toggleAlert={this.props.toggleAlert}
                getInventory={this.props.getInventory}
                loadProducts={this.loadProducts} />
              : null
          }
        </>
      )
    } else {
      return null
    }
  }

}

export default AddToBar