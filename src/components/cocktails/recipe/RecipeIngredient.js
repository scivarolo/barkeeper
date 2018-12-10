import React, { Component } from 'react'
import { Button } from 'reactstrap'

//TODO: check if an ingredient or a product for that ingredient is already in the shopping list and show a message instead of add to shopping list button.
class RecipeIngredient extends Component {

  render() {

    let canMake = this.props.canMake

    return (
      <li className={canMake ? "" : "text-danger ingredient--can-make"}>
        <span className="ingredient__amount">{this.props.ingredient.amount}</span>
        <span className="ingredient__unit">{this.props.ingredient.unit}</span>
        <span className="ingredient__label">{this.props.label}</span>
        {canMake ? "" : <Button size="sm"
                                onClick={() => this.props.addToShoppingList(this.props.ingredient)}
                                className="ml-2 ingredient-add-button">Add to Shopping List</Button>}
      </li>
    )
  }

}

export default RecipeIngredient