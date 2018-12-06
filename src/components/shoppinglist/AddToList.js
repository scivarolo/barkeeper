import React, { Component } from 'react';
import {
  Button,
  InputGroupAddon } from 'reactstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css'
import user from '../../modules/data/user';
import API from '../../modules/data/API'

class AddToList extends Component {

  state = {
    allProducts: [],
    selected: []
  }

  loadProducts() {
    return API.getAll("products")
      .then(products => this.setState({products: products}))
  }

  addDropdownProducts = () => {
    let userId = user.getId()
    let products = this.state.selected
    let savePromises = products.map(product => API.saveData("userShopping", {
      productId: product.id,
      userId: userId,
      quantity: 1
    }))
    return Promise.all(savePromises)
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

export default AddToList