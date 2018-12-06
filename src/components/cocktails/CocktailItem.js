import React, { Component } from 'react'
import {
  Button,
  Col,
  Row,
  ListGroupItem,
} from 'reactstrap'
import API from '../../modules/data/API';

class CocktailItem extends Component {

  deleteItem(id) {
    return API.deleteData("userCocktails", id)
    .then(() => this.props.getCocktailData())
  }

  render() {
    let cocktail = this.props.cocktail
    let ingredients = this.props.ingredients
    return (
      <ListGroupItem className="mb-3" key={cocktail.id}>
        <h2 className="mb-3">{cocktail.name}</h2>
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
          <Col>
            <Button size="sm" onClick={() => this.deleteItem(this.props.userCocktail.id)}>Remove</Button>
          </Col>
        </Row>
      </ListGroupItem>
    )
  }

}

export default CocktailItem