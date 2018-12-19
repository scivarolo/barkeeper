import React, { Component } from 'react'
import {
  FormGroup,
  Label,
  Input
  } from "reactstrap"
import API from '../../modules/data/API';

class IngredientFilter extends Component {

  state = {
    ingredients: []
  }

  componentDidMount() {
    API.getAll("ingredients")
    .then(ingredients => {
      ingredients.sort((a,b) => {
        a = a.label.toLowerCase()
        b = b.label.toLowerCase()
        return (a < b) ? -1 : (a > b) ? 1 : 0
      })
      this.setState({ingredients: ingredients})
    })
  }

  handleChange = (e) => {
    this.setState({ingredientFilter: Number(e.target.id)})
    this.props.filterByIngredient(this.props.cocktails, this.props.cocktailIngredients, Number(e.target.id))
  }

  clear = () => {
    this.setState({ingredientFilter: ""})
  }

  render() {
    let ingredients = this.state.ingredients

    return (
      <div className="mt-3">
        <FormGroup id="ingredientFilter" tag="fieldset">
          <legend>Filter by Ingredient</legend>
          {
            ingredients.map(ingredient => {
              return (
                <FormGroup key={ingredient.id} check>
                  <Label check>
                    <Input
                      type="radio"
                      id={ingredient.id}
                      checked={this.state.ingredientFilter === ingredient.id}
                      onChange={
                        e => this.handleChange(e)
                      }
                      name="ingredientFilter" />{` ${ingredient.label}`}
                  </Label>
                </FormGroup>
              )
            })
          }
          </FormGroup>
      </div>
    )
  }

}

export default IngredientFilter