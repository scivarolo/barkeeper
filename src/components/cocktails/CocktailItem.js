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
    if(!userInventory.find(item => item.product.ingredientId === ingredient.ingredientId)) {
      canMake = false
      this.setState({userCanMake: false})
    }
    this.ingredientToState(ingredient, "canMake", canMake)
    this.ingredientAvailability(ingredient.ingredientId, canMake)
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

    let { cocktail, ingredients, userInventory } = this.props

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
                      label={ingredients[i].label} />
                    // <li key={ingredient.id}>{ingredient.amount} {ingredient.unit} {ingredients[i].label}</li>
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