/**
 * Form for adding an ingredient to the shopping list.
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

class AddIngredient extends Component {

  state = {
    ingredients: [],
    selected: []
  }

  loadIngredients() {
    return API.getAll("ingredients")
      .then(ingredients => this.setState({ingredients: ingredients}))
  }

  addDropdownIngredients = () => {
    if(!this.state.selected.length) return

    // Save ingredients to the shopping list
    let ingredients = this.state.selected

    let savePromises = ingredients.map(ingredient => {
      let haveIngredient = this.props.shoppingList.find(shopIngredient => shopIngredient.ingredient_id === ingredient.id)
      if (haveIngredient) {
        return API.edit("user_shopping", haveIngredient.id, {
          quantity: haveIngredient.quantity + 1
        })
      } else {
        return API.save("user_shopping", {
          ingredient_id: ingredient.id,
          product_id: null,
          quantity: 1
        })
      }
    })
    return Promise.all(savePromises)
      .then(() => {
        let products = this.state.selected.map(product => product.label)
        this.props.toggleAlert("success", "Product(s) Added to Shopping List", `${products.join(" & ")} successfully added.`)
      })
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
            labelKey="name"
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

AddIngredient.propTypes = {
  shoppingList: PropTypes.array.isRequired,
  toggleAlert: PropTypes.func.isRequired,
  getShoppingData: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
}