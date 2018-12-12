import React, { Component } from 'react'
import { Button } from 'reactstrap'

//TODO: check if an ingredient or a product for that ingredient is already in the shopping list and show a message instead of add to shopping list button.
class RecipeIngredient extends Component {

  state = {
    inShoppingList: false
  }

  inShoppingList = () => {
    let found = this.props.userShoppingList.find(shoppingItem => {
      return this.props.ingredient.ingredientId === shoppingItem.ingredientId || this.props.ingredient.ingredientId === shoppingItem.product.ingredientId
    })
    if(found) {
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

    let canMake = this.props.canMake

    return (
      <li className={canMake ? "" : "text-danger ingredient--can-make"}>
        <span className="ingredient__amount">{this.props.ingredient.amount}</span>
        <span className="ingredient__unit">{this.props.ingredient.unit}</span>
        <span className="ingredient__label">{this.props.label}</span>
        {(!canMake)
          ? !this.state.inShoppingList
            ? <Button size="sm"
              onClick={() => this.props.addToShoppingList(this.props.ingredient)}
              className="ml-2 ingredient-add-button">Add to Shopping List</Button>
            : <span className="in-shopping-list">In your shopping list</span>
          : "" }
      </li>
    )
  }

}

export default RecipeIngredient