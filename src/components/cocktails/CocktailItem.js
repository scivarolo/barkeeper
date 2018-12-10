import React, { Component } from 'react'
import {
  Badge,
  Button,
  Col,
  Row,
  ListGroupItem,
} from 'reactstrap'
import API from '../../modules/data/API';
import "./cocktailItem.scss"
import RecipeIngredient from './recipe/RecipeIngredient';
import user from '../../modules/data/user'
import Units from '../../modules/UnitConverter';

class CocktailItem extends Component {

  state = {
    userCanMake: true,
    ingredientsStatus: {},
    ingredientAvailability: {}
  }

  ingredientToState = (ingredient, key, value) => {
    //store the values for each ingredient in object together
    //store all ingredient objects in an object together
    this.setState(prevState => {
      let obj = Object.assign({}, prevState.ingredientsStatus)
      let objectKey = ingredient.id
      if(!obj[objectKey]) obj[objectKey] = {}
      obj[objectKey][key] = value

      return {
        ingredientsStatus: obj
      }
    })
  }

  ingredientAvailability = (key, value) => {
    this.setState(prevState => {
      //key is ingredient.id
      //value is true or false
      let obj = Object.assign({}, prevState.ingredientAvailability, {[key]: value})
      return {ingredientAvailability: obj}
    })
  }



  deleteItem(id) {
    return API.deleteData("userCocktails", id)
    .then(() => this.props.getCocktailData())
  }

  compareIngredient(ingredient, userInventory) {
    let canMake = true
    let products = userInventory.filter(item => item.product.ingredientId === ingredient.ingredientId)
    if(!products.length) {
      canMake = false
      this.setState({userCanMake: false})
    } else {
      //TODO: When there are multiple products that match an ingredient
      products.forEach(product => {
        let amount = product.amountAvailable
        let unit = product.product.unit
        let comparison = Units.compare(amount, unit, ingredient.amount, ingredient.unit)
        console.log(comparison)
        if(comparison === 1 || comparison === 0) {
          canMake = true
        } else {
          canMake = false
        }
      })
    }
    this.ingredientToState(ingredient, "canMake", canMake)
    this.ingredientAvailability(ingredient.ingredientId, canMake)
  }

  addToShoppingList = (...ingredients) => {
    //Array of missing ingredients to add to shopping list.
    let addArray = []
    ingredients.forEach(ingredient => {
      addArray.push(API.saveData("userShopping", {
        ingredientId: ingredient.id,
        productId: false,
        userId: user.getId(),
        quantity: 1
      }))
      return Promise.all(addArray)
    })
  }

  componentDidMount() {
    this.props.cocktail.cocktailIngredients.forEach(ingredient => {
      this.compareIngredient(ingredient, this.props.userInventory)
    })
  }

  componentDidUpdate(prevProps) {
    //Loop through recipe ingredients to find if recipe can be made with user inventory
    if(this.props.userInventory !== prevProps.userInventory) {
      this.setState({userCanMake: true})
      this.props.cocktail.cocktailIngredients.forEach(ingredient => {
        this.compareIngredient(ingredient, this.props.userInventory)
      })
    }
  }

  render() {

    let { cocktail, ingredients } = this.props

    return (
      <ListGroupItem className="mb-3" key={cocktail.id}>
        <div className="d-flex justify-content-between">
          <div>
            <h2 className="mb-3">{cocktail.name}</h2>
          </div>
          <div className="mt-1 recipe-badge">
            { this.state.userCanMake
              ? <Badge color="success">You can make this!</Badge>
              : <Badge color="danger">You are missing ingredients!</Badge>
            }
          </div>
        </div>

        <Row>
          <Col>
            <h5>Ingredients</h5>
            <ul>
              {
                cocktail.cocktailIngredients.map((ingredient, i) => {
                  return (
                    <RecipeIngredient
                      key={ingredient.id}
                      canMake={this.state.ingredientAvailability[ingredient.ingredientId]}
                      ingredient={ingredient}
                      addToShoppingList={this.addToShoppingList}
                      label={ingredients[i].label} />
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
        <Row>
          <Col className="d-flex justify-content-end">
            <Button size="sm" onClick={() => this.deleteItem(this.props.userCocktail.id)}>Remove</Button>
          </Col>
        </Row>
      </ListGroupItem>
    )
  }

}

export default CocktailItem