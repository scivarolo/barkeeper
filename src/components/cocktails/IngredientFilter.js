import React, { Component } from "react"
import PropTypes from "prop-types"
import {
  FormGroup,
  Label,
  Input
} from "reactstrap"
import API from "../../modules/data/data"
import "./ingredientFilter.scss"

class IngredientFilter extends Component {

  state = {
    ingredients: []
  }

  componentDidMount() {
    API.getAll("ingredients")
      .then(ingredients => this.setState({ingredients: ingredients}))
  }

  handleChange = (e) => {
    let id = e.target.id
    if (id !== "noFilter") id = Number(e.target.id)
    this.setState({ingredientFilter: id})
    this.props.filterByIngredient(this.props.cocktails, id)
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
                      name="ingredientFilter" />{` ${ingredient.name}`}
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

IngredientFilter.displayName = "IngredientFilter"
IngredientFilter.propTypes = {
  filterByIngredient: PropTypes.func.isRequired,
  cocktails: PropTypes.array.isRequired,
  cocktailIngredients: PropTypes.array.isRequired
}