import React, { Component } from 'react'
import {
  Button,
  InputGroupAddon } from 'reactstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css'
import user from '../../modules/data/user'
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
    if(!this.state.selected.length) return
    let userId = user.getId()
    let ingredients = this.state.selected

    let savePromises = ingredients.map(ingredient => {
      let haveIngredient = this.props.shoppingList.find(shopIngredient => shopIngredient.ingredientId === ingredient.id)
      if(haveIngredient) {
        return API.editData("userShopping", haveIngredient.id, {
          quantity: haveIngredient.quantity + 1
        })
      } else {
        return API.saveData("userShopping", {
          ingredientId: ingredient.id,
          productId: false,
          userId: userId,
          quantity: 1
        })
      }
    })
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
            options={this.state.ingredients.sort((a,b) => {
              let aName = a.label.toUpperCase()
              let bName = b.label.toUpperCase();
              return (aName < bName) ? -1 : (aName > bName) ? 1 : 0;
            })}
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