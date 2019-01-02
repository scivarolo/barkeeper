import React, { Component } from 'react'
import { Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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