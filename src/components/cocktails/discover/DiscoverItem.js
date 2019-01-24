import React, { Component } from 'react'
import {
  Col,
  Row,
  ListGroupItem } from 'reactstrap'
import API from '../../../modules/data/API'
import RecipeIngredient from '../recipe/RecipeIngredient'
import user from '../../../modules/data/user'
import CocktailEditModal from '../CocktailEditModal'
import "../cocktailItem.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class DiscoverItem extends Component {

  state = { }
  // Adds a cocktail receipe to the user's list.
  userAddsCocktail = () => {
    let obj = {
      "userId": user.getId(),
      "cocktailId": this.props.cocktail.id,
      "wantToMake": true,
      "makeCount": 0
    }
    return API.saveData("userCocktails", obj)
    .then(() => this.props.getUserCocktailData())
    .then(() => this.props.allMinusUserCocktails())
  }

  render() {

    let { cocktail, ingredients } = this.props

    return (
      <ListGroupItem className={`mb-3 cocktail-item`} key={cocktail.id}>
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
            </span>
          </div>
          <div className="mt-1 recipe-badge">
            <FontAwesomeIcon
              icon="bookmark"
              className="bookmark-recipe"
              onClick={this.userAddsCocktail} />
          </div>
        </div>

        <Row>
          <Col md={5}>
            <h5>Ingredients</h5>
            <ul className="recipe-ingredients mb-2">
              {
                cocktail.cocktailIngredients.map((cIngredient, i) => {
                  return (
                    <RecipeIngredient
                      key={cIngredient.id}
                      canMake={true}
                      ingredient={cIngredient}
                      label={ingredients.find(label => label.id === cIngredient.ingredientId).label} />
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

export default DiscoverItem