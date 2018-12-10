import React, { Component } from 'react';
import {
  Button,
  InputGroupAddon } from 'reactstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css'
import user from '../../modules/data/user';
import API from '../../modules/data/API'

class AddIngredient extends Component {

  state = {
    allIngredients: [],
    selected: []
  }

  loadIngredients() {
    return API.getAll("ingredients")
      .then(ingredients => this.setState({ingredients: ingredients}))
  }

  addDropdownIngredients = () => {
    let userId = user.getId()
    let ingredients = this.state.selected
    let savePromises = ingredients.map(ingredient => API.saveData("userShopping", {
      ingredientId: ingredient.id,
      productId: "",
      userId: userId,
      quantity: 1
    }))
    return Promise.all(savePromises)
      .then(() => this.setState({selected: []}))
      .then(() => this.props.getShoppingData())
      .then(() => this.props.toggle())
  }

  componentDidMount() {
    this.loadIngredients()
  }

  render() {
    if(this.props.show) {
      return (
        <>
          <Typeahead
            labelKey="label"
            multiple={true}
            options={this.state.ingredients}
            placeholder="Search for ingredients"
            onChange={selected => this.setState({selected: selected})} />
          <InputGroupAddon addonType="append">
            <Button onClick={this.addDropdownIngredients}>Add</Button>
          </InputGroupAddon>
        </>
      )
    } else {
      return null
    }
  }

}

export default AddIngredient