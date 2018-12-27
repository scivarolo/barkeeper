import React, { Component } from 'react'
import {
  Button,
  Col,
  Row,
  ListGroupItem } from 'reactstrap'
import API from '../../../modules/data/API'
import RecipeIngredient from '../recipe/RecipeIngredient'
import user from '../../../modules/data/user'
import CocktailEditModal from '../CocktailEditModal'
import "../cocktailItem.scss"

class DiscoverItem extends Component {

  state = { }

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
      <ListGroupItem className={`mb-3`} key={cocktail.id}>
        <div className="d-flex mb-3 justify-content-between cocktail-header">
          <div>
            <h2 className="mb-3 cocktail-name">{cocktail.name}</h2>
          </div>
          <div className="mt-1 recipe-badge">
            <Button
              onClick={() => this.userAddsCocktail()}
              size="sm"
              className="mr-2">Save</Button>
          </div>
        </div>

        <Row>
          <Col md={5}>
            <h5>Ingredients</h5>
            <ul className="recipe-ingredients">
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
        <Row>
          <Col className="d-flex justify-content-end">
            {
              this.props.cocktail.createdBy === user.getId()
              ? <CocktailEditModal
                buttonLabel="Edit"
                cocktail={cocktail}
                ingredientNames={ingredients}
                getUserCocktailData={this.props.getUserCocktailData}  />
              : null
            }
          </Col>
        </Row>
      </ListGroupItem>
    )
  }

}

export default DiscoverItem