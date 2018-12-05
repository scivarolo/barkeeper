import React, { Component } from 'react'
import {
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem } from 'reactstrap'
import API from '../../modules/data/API';

class Cocktails extends Component {

  state = {
    isLoaded: false,
    userCocktails: [],
    cocktails: [],
    cocktailIngredients: []
  }

  componentDidMount() {
    let userId = sessionStorage.getItem("id")
    let data = {
      isLoaded: true
    }
    //get userCocktails
    API.getWithExpand("userCocktails", "cocktail", userId)
    .then(userCocktails => {
      data.userCocktails = userCocktails
      //use cocktailId to get cocktails
      let cocktailQueries = userCocktails
        .map(c => API.getWithEmbed(`cocktails/${c.cocktailId}`, "cocktailIngredients"))
      //each Promise returns a cocktail with cocktailIngredients embedded
      return Promise.all(cocktailQueries)
    })
    .then(cocktails => {
      data.cocktails = cocktails

      //for each cocktail, loop through array of ingredients to build fetchs for each ingredient
      let ingredientQueries = []
      cocktails.forEach(c => {
        //build query string for getting ingredient names of each cocktail
        let queryString = c.cocktailIngredients.reduce((q, ing) => q + `&id=${ing.ingredientId}`, '').substr(1)
        ingredientQueries.push(API.getAll(`ingredients?${queryString}`))
      })
      return Promise.all(ingredientQueries)
    })
    .then(cocktailIngredients => {
      data.cocktailIngredients = cocktailIngredients
    })

    //use ingredientIds to get ingredient names

    .then(() => this.setState(data))
  }

  render() {

    let cocktails = this.state.cocktails
    let ingredients = this.state.cocktailIngredients

    if(this.state.isLoaded) {
      return (
        <Container>
          <Row>
            <Col>
              <h1>Cocktails</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <ListGroup>
                {
                  cocktails.map((cocktail, i) => {
                    let ingredientLabels = ingredients[i]
                    console.log(ingredientLabels)

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
                                    <li key={ingredient.id}>{ingredient.amount} {ingredient.unit} {ingredientLabels[i].label}</li>
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
                  })
                }
              </ListGroup>
            </Col>
          </Row>
        </Container>
      )
    } else {
      return (
        <Container>
          <Row>
            <Col>
              <div>Loading</div>
            </Col>
          </Row>
        </Container>
      )
    }
  }

}

export default Cocktails