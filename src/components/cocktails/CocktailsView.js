import React, { Component } from 'react'
import {
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem } from 'reactstrap'
import API from '../../modules/data/API';
import CocktailAddModal from './CocktailAddModal';
import CocktailItem from './CocktailItem';

class CocktailsView extends Component {

  state = {
    isLoaded: false,
    userCocktails: [],
    cocktails: [],
    cocktailIngredients: []
  }

  getCocktailData = () => {
    let userId = sessionStorage.getItem("id")
    let data = {}
    //get userCocktails
    return API.getWithExpand("userCocktails", "cocktail", userId)
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
    .then(() => this.setState(data))
  }

  componentDidMount() {
    this.getCocktailData()
    .then(() => this.setState({isLoaded: true}))
  }

  render() {

    /* cocktails contains the ingredient Ids
     * userCocktail contains the id needed for delete
     * and creating the keys for the ListGroupItems
     * ingredients contains the ingredient labels
     */
    let userCocktails = this.state.userCocktails
    let cocktails = this.state.cocktails
    let ingredients = this.state.cocktailIngredients

    if(this.state.isLoaded) {
      return (
        <Container>
          <Row className="my-5">
            <Col className="d-flex">
              <div>
                <h1>Cocktails</h1>
              </div>
              <div className="ml-auto">
                <CocktailAddModal
                  buttonLabel="Add Cocktails"
                  getCocktailData={this.getCocktailData} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <ListGroup>
                {
                  cocktails.map((cocktail, i) => {
                    return (<CocktailItem
                      key={userCocktails[i].id}
                      userCocktail={userCocktails[i]}
                      cocktail={cocktail}
                      ingredients={ingredients[i]}
                      getCocktailData={this.getCocktailData} />)
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

export default CocktailsView