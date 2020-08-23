/**
 * Displays a single ingredient in a recipe
 * with functionality for adding to shopping list
 * if the ingredient is not available in the user's inventory
 **/

import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
class RecipeIngredient extends Component {

  state = {
    inShoppingList: false
  }

  inShoppingList = () => {
    let { userShoppingList, ingredient } = this.props

    // Check if the ingredient or matching product has already been added to the shopping list
    let foundIngredient = userShoppingList.find(shoppingItem => shoppingItem.ingredient_id === ingredient.ingredient.id)
    let foundProduct = userShoppingList.find(shoppingItem => shoppingItem.product ? shoppingItem.product.ingredient === ingredient.ingredient.id : false)

    if(foundIngredient || foundProduct) {
      this.setState({inShoppingList: true})
    } else {
      this.setState({inShoppingList: false})
    }
  }

  componentDidMount() {
    if(this.props.userShoppingList) this.inShoppingList()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userShoppingList !== this.props.userShoppingList) {
      this.inShoppingList()
    }
  }

  render() {

    let { canMake, ingredient } = this.props

    return (
      <li className={canMake ? "" : "text-danger ingredient--cant-make"}>
        <span className="ingredient__amount-wrap">
          <span className="ingredient__amount">{ingredient.amount}</span>
          <span className="ingredient__unit">{
            ingredient.unit !== "count" ? ingredient.unit : null
          }</span>
        </span>
        <span className="ingredient__label">{this.props.label}</span>
        {(!canMake)
          ? !this.state.inShoppingList
            ? <FontAwesomeIcon className="ingredient-add-button"
              onClick={() => this.props.addToShoppingList(ingredient)}
              icon="cart-plus" />
            : <FontAwesomeIcon
              className="in-shopping-list"
              icon="check-circle" />
          : null }
      </li>
    )
  }
}

export default RecipeIngredient