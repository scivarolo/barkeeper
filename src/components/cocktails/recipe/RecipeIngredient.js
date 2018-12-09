import React, { Component } from 'react'
import { Button } from 'reactstrap'

class RecipeIngredient extends Component {

  render() {

    let canMake = this.props.canMake

    return (
      <li className={canMake ? "" : "text-danger ingredient--can-make"}>
        <span className="ingredient__amount">{this.props.ingredient.amount}</span>
        <span className="ingredient__unit">{this.props.ingredient.unit}</span>
        <span className="ingredient__label">{this.props.label}</span>
        {canMake ? "" : <Button size="sm" className="ml-2 ingredient-add-button">Add to Shopping List</Button>}
      </li>
    )
  }

}

export default RecipeIngredient