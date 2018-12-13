import React, { Component } from 'react'
import {
  Button,
  InputGroupAddon } from 'reactstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css'
import user from '../../modules/data/user'
import API from '../../modules/data/API'
import NewProduct from '../create/NewProduct'

//TODO: Disable Product Typeahead while new product is being created.
//TODO: If they cancel creating new product, remove the entry from the Typeahead.

class AddToBar extends Component {

  state = {
    allProducts: [],
    selected: [],
    showCreateNewProduct: false
  }

  loadProducts = () => {
    return API.getAll("products")
      .then(products => this.setState({allProducts: products}))
  }

  addDropdownProducts = () => {
    if(!this.state.selected.length) return
    let userId = user.getId()
    let products = this.state.selected
    let savePromises = products.map(product => {

      let haveProduct = this.props.inventory.find(invProduct => invProduct.productId === product.id)
      if(haveProduct) {
        return API.editData("userProducts", haveProduct.id, {
          quantity: haveProduct.quantity + 1
        })
      }
      else {
        return API.saveData("userProducts", {
          productId: product.id,
          userId: userId,
          quantity: 1,
          amountAvailable: this.state.allProducts.find(p => parseInt(p.id) === parseInt(product.id)).fullAmount
        })
      }
    })
    return Promise.all(savePromises)
      .then(() => this.setState({selected: []}))
      .then(() => this.props.getInventoryData())
      .then(() => {
        this.props.toggleSuccessMessage("Products were successfully added to your bar.")
        this.props.toggle()
      })
  }

  toggleCreateNewProduct = () => {
    this.setState({showCreateNewProduct: !this.state.showCreateNewProduct})
  }

  dropdownChange(selected) {
    this.setState({selected: selected})
    if(selected[selected.length - 1] && selected[selected.length - 1].customOption) {
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
            multiple={true}
            options={this.state.allProducts.sort((a,b) => {
              let aName = a.name.toUpperCase()
              let bName = b.name.toUpperCase();
              return (aName < bName) ? -1 : (aName > bName) ? 1 : 0;
            })}
            placeholder="Search for products"
            onChange={selected => this.dropdownChange(selected)} />
          <InputGroupAddon addonType="append">
            <Button onClick={this.addDropdownProducts}>Add</Button>
          </InputGroupAddon>
          {
            this.state.showCreateNewProduct
            ? <NewProduct
                product={this.state.selected[this.state.selected.length - 1]}
                toggle={this.toggleCreateNewProduct}
                toggleSuccessMessage={this.props.toggleSuccessMessage}
                getInventoryData={this.props.getInventoryData}
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