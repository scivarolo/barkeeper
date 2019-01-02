import React, { Component } from 'react'
import {
  Badge,
  Button,
  Col,
  Row,
  ListGroupItem } from 'reactstrap'
import API from '../../modules/data/API'
import RecipeIngredient from './recipe/RecipeIngredient'
import user from '../../modules/data/user'
import Units from '../../modules/UnitConverter'
import CocktailEditModal from './CocktailEditModal'
import "./cocktailItem.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class CocktailItem extends Component {

  state = {
    userCanMake: true,
    ingredientsStatus: {},
    ingredientAvailability: {}
  }

  ingredientStatusToState = (ingredient, key, value) => {
    //store the values for each ingredient in object together
    //store all ingredient objects in an object together
    this.setState(prevState => {
      let obj = Object.assign({}, prevState.ingredientsStatus)
      let objectKey = ingredient.id
      if (!obj[objectKey]) obj[objectKey] = {}
      obj[objectKey][key] = value

      return {
        ingredientsStatus: obj
      }
    })
  }

  ingredientAvailabilityToState = (key, value) => {
    this.setState(prevState => {
      //key is ingredient.id
      //value is true or false
      let obj = Object.assign({}, prevState.ingredientAvailability, {[key]: value})
      return {ingredientAvailability: obj}
    })
  }

  deleteItem(id) {
    return API.deleteData("userCocktails", id)
    .then(() => this.props.getUserCocktailData())
  }

  canMakeRecipe = () => {
    let canMakeRecipe = true
    let statuses = Object.values(this.state.ingredientsStatus)
    statuses.forEach(status => {
      if (status.canMake === false) canMakeRecipe = false
    })
    this.setState({userCanMake: canMakeRecipe})

  }
  checkIngredientsAgainstInventory = () => {
    let ingredientPromises = []

    this.props.cocktail.cocktailIngredients.sort((a, b) => {
      return a.sortOrder - b.sortOrder
    }).forEach(ingredient => {
      ingredientPromises.push(
        this.checkSingleIngredientAgainstInventory(ingredient, this.props.userInventory)
      )
    })

    return Promise.all(ingredientPromises)
    .then(() => this.canMakeRecipe())

  }
  checkSingleIngredientAgainstInventory = (ingredient, userInventory) => {
    let canMake
    //Find the items in the user's inventory that match the ingredient
    let products = userInventory.filter(item => item.product.ingredientId === ingredient.ingredientId)
    if (!products.length) {
      canMake = false
    } else {
      let productsTotalMl = 0
      //loop through that ingredient's products and sum the total.
      products.forEach(product => {
        let amount = product.amountAvailable + (product.product.fullAmount * (product.quantity - 1))
        let unit = product.product.unit
        let amountMl = Units.convert(amount, unit, "ml")
        productsTotalMl += amountMl
      })
      let comparison = Units.compare(productsTotalMl, "ml", ingredient.amount, ingredient.unit)
      if (comparison === 1 || comparison === 0) {
        canMake = true
      } else {
        canMake = false
      }

    }

    this.ingredientStatusToState(ingredient, "canMake", canMake)
    this.ingredientAvailabilityToState(ingredient.ingredientId, canMake)
  }

  addToShoppingList = (...ingredients) => {
    //Array of missing ingredients to add to shopping list.
    let addArray = []
    ingredients.forEach(ingredient => {
      addArray.push(API.saveData("userShopping", {
        ingredientId: ingredient.ingredientId,
        productId: false,
        userId: user.getId(),
        quantity: 1
      }))
    })
    return Promise.all(addArray)
    .then(() => this.props.getShoppingList())
  }

  componentDidMount() {
    this.checkIngredientsAgainstInventory()
  }

  componentDidUpdate(prevProps) {
    if (this.props.userInventory !== prevProps.userInventory || this.props.cocktail !== prevProps.cocktail) {
      this.checkIngredientsAgainstInventory()
    }

  }

  render() {

    let { cocktail, ingredients } = this.props

    let hide = ""
    if(!this.state.userCanMake && this.props.showOnlyMakeable) {
      hide = "d-none"
    }
    return (
      <ListGroupItem className={`mb-3 ${hide} cocktail-item`} key={cocktail.id}>
        <div className="d-flex mb-3 justify-content-between cocktail-header">
          <div>
            <h2 className="mb-3 cocktail-name d-inline-block">{cocktail.name}</h2>
            <span className="cocktail-utils">
              {
                this.props.cocktail.createdBy === user.getId()
                ? <CocktailEditModal
                  buttonLabel="Edit"
                  cocktail={cocktail}
                  ingredientNames={ingredients}
                  getUserCocktailData={this.props.getUserCocktailData}  />
                : null
              }
              <FontAwesomeIcon
                icon="trash"
                className="cocktail-remove ml-2"
                onClick={() => this.deleteItem(this.props.userCocktail.id)} />
            </span>
          </div>
          <div className="mt-1 recipe-badge">
            { this.state.userCanMake
              ? <div>
                  <Button
                    onClick={() => this.props.addToUserTab(cocktail.id)}
                    size="sm"
                    className="mt-1"
                    color="warning">Add to my Tab</Button>
                </div>
              : <Badge color="danger">Missing ingredients!</Badge>
            }
          </div>
        </div>

        <Row>
          <Col md={5}>
            <h5>Ingredients</h5>
            <ul className="recipe-ingredients mb-2">
              {
                cocktail.cocktailIngredients.map((ingredient, i) => {
                  return (
                    <RecipeIngredient
                      key={ingredient.id}
                      canMake={this.state.ingredientAvailability[ingredient.ingredientId]}
                      ingredient={ingredient}
                      userShoppingList={this.props.userShoppingList}
                      addToShoppingList={this.addToShoppingList}
                      label={ingredients.find(label => label.id === ingredient.ingredientId).label} />
                  )
                })
              }
            </ul>
          </Col>
          <Col>
            <h5>Instructions</h5>
            <p>{cocktail.instructions}</p>
          </Col>
        </Row>
      </ListGroupItem>
    )
  }

}

export default CocktailItem