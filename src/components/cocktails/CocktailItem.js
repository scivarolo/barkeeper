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

class CocktailItem extends Component {

  state = {
    userCanMake: true
  }

  deleteItem(id) {
    return API.deleteData("userCocktails", id)
    .then(() => this.props.getCocktailData())
  }

  compareIngredient(ingredient, userInventory) {
    if(!userInventory.find(item => item.product.ingredientId === ingredient.ingredientId)) {
      this.setState({userCanMake: false})
    }
  }

  componentDidMount() {
    this.props.cocktail.cocktailIngredients.forEach(ingredient => {
      this.compareIngredient(ingredient, this.props.userInventory)
      console.log(ingredient)
    })
  }

  componentDidUpdate(prevProps) {
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
                    <li key={ingredient.id}>{ingredient.amount} {ingredient.unit} {ingredients[i].label}</li>
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