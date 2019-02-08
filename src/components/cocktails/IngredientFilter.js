import React, { Component } from "react"
import {
  FormGroup,
  Label,
  Input
} from "reactstrap"
import jsonAPI from "../../modules/data/API"
import "./ingredientFilter.scss"

class IngredientFilter extends Component {

  state = {
    ingredients: []
  }

  componentDidMount() {
    jsonAPI.getAll("ingredients")
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
    let id = e.target.id
    if (id !== "noFilter") id = Number(e.target.id)
    this.setState({ingredientFilter: id})
    this.props.filterByIngredient(this.props.cocktails, this.props.cocktailIngredients, id)
  }

  clear = () => {
    this.setState({ingredientFilter: ""})
  }

  render() {
    let ingredients = this.state.ingredients

    return (
      <div className="mt-3">
        <FormGroup className="ingredient-filter" id="ingredientFilter" tag="fieldset">
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
          <FormGroup key="none" check>
            <Label check>
              <Input
                type="radio"
                name="ingredientFilter"
                id="noFilter"
                onChange={e => this.handleChange(e)} />{" Reset"}
            </Label>
          </FormGroup>
        </FormGroup>
      </div>
    )
  }

}

export default IngredientFilter