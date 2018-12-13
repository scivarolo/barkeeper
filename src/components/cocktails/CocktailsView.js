import React, { Component } from 'react'
import {
  Button,
  Container,
  Row,
  Col,
  ListGroup } from 'reactstrap'
import { Link } from 'react-router-dom'
import API from '../../modules/data/API';
import CocktailAddModal from './CocktailAddModal';
import CocktailItem from './CocktailItem';
import { Alert, AlertContainer } from 'react-bs-notifier'
import user from '../../modules/data/user';
import BarTab from '../bartab/BarTab';
import Units from '../../modules/UnitConverter'

class CocktailsView extends Component {

  state = {
    isLoaded: false,
    userCocktails: [],
    cocktails: [],
    cocktailIngredients: [],
    userTab: [],
    userInventory: [],
    userShoppingList: [],
    showSuccessMessage: false,
    successMessage: "",
    showOnlyMakeable: false
  }

  toggleMakeable = () => {
    this.setState({showOnlyMakeable: !this.state.showOnlyMakeable})
  }

  toggleSuccessMessage = (message) => {
    this.setState({showSuccessMessage: true, successMessage: message})
    setTimeout(function(){
      this.setState({showSuccessMessage: false, successMessage: ""});
    }.bind(this), 3000)
  }

  getCocktailData = () => {
    let userId = user.getId()
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
      data.cocktails = cocktails.sort((a,b) => {
        let aName = a.name.toUpperCase()
        let bName = b.name.toUpperCase();
        return (aName < bName) ? -1 : (aName > bName) ? 1 : 0;
      })

      //for each cocktail, loop through array of ingredients to build fetchs for each ingredient
      let ingredientQueries = []
      cocktails.forEach(c => {
        //build query string for getting ingredient names of each cocktail
        let queryString = c.cocktailIngredients.reduce((q, ing) => q + `&id=${ing.ingredientId}`, '')
        ingredientQueries.push(API.getWithFilters(`ingredients`, queryString))
      })
      return Promise.all(ingredientQueries)
    })
    .then(cocktailIngredients => {
      data.cocktailIngredients = cocktailIngredients
    })
    .then(() => this.setState(data))
  }

  getUserInventory() {
    let userId = user.getId()
    API.getWithExpand("userProducts", "product", userId)
    .then(data => this.setState({userInventory: data}))
  }

  getShoppingList = () => {
    let userId = user.getId()
    API.getWithExpands("userShopping", userId, "product", "ingredient")
    .then(data => this.setState({userShoppingList: data}))
  }

  getUserTab = () => {
    let userId = user.getId()
    API.getWithExpands("userTab", userId, "cocktail")
    .then(data => this.setState({userTab: data}))
  }

  addToUserTab = (cocktailId) => {
    //TODO: let user specify quantity. Or let them do it once its in the tab.
    let inTab = this.state.userTab.find(tabCocktail => tabCocktail.cocktailId === cocktailId)
    if(inTab) {
      let obj = {
        quantity: inTab.quantity + 1
      }
      return API.editData("userTab", inTab.id, obj)
      .then(() => this.getUserTab())
    }

    // Not in tab already
    let obj = {
      userId: user.getId(),
      cocktailId: cocktailId,
      quantity: 1
    }
    return API.saveData("userTab", obj)
    .then(() => this.getUserTab())
  }

  makeCocktail = (c) => {
    //c = the cocktail.
    return API.getWithFilters("cocktailIngredients", `cocktailId=${c.cocktailId}`)
      .then((ingredients) => {
        /**
         * Loop through each of the cocktail's ingredients
         * Find the first product in the inventory that matches
         * and calculate how much will be left.
         * Return all updates in a Promise.all
         * TODO: user can choose which product to use if there are multiple options
         */
        let productUpdates = []

        //Check if all ingredients are available
        let canMake = true
        ingredients.forEach(ingredient => {
          const prod = this.state.userInventory.find(item => item.product.ingredientId === ingredient.ingredientId)
          if (!prod) return canMake = false

          const amountNeeded = ingredient.amount * c.quantity
          const amountUnit = ingredient.unit
          const amountNeededMl = Units.convert(amountNeeded, amountUnit, "ml")
          const prodAvailable = Units.convert((prod.amountAvailable + (prod.product.fullAmount * prod.quantity)), prod.product.unit, "ml")

          const amountLeft = prodAvailable - amountNeededMl
          if (amountLeft < 0) canMake = false
        })
        if (canMake) {
          ingredients.forEach(ingredient => {
            const prod = this.state.userInventory.find(item => item.product.ingredientId === ingredient.ingredientId)
            if (!prod) return alert(`You're missing a necessary product`)

            const amountNeeded = ingredient.amount * c.quantity
            const amountUnit = ingredient.unit
            const amountNeededMl = Units.convert(amountNeeded, amountUnit, "ml")
            const prodAvailable = Units.convert((prod.amountAvailable + (prod.product.fullAmount * (prod.quantity - 1))), prod.product.unit, "ml")

            const amountLeft = prodAvailable - amountNeededMl
            const quantityLeft = amountLeft / prod.product.fullAmount
            const quantityCeil = Math.ceil(quantityLeft)
            const newAmountAvailable = amountLeft % prod.product.fullAmount

            const userProductId = prod.id
            const userProductPatchObj = {
              amountAvailable: newAmountAvailable,
              quantity: quantityCeil
            }

            if (amountLeft < 0) {
              return alert(`You don't have enough of an ingredient to make this many.`)
            } else if (amountLeft === 0) {
              return productUpdates.push(
                API.deleteData("userProducts", userProductId)
              )
            } else {
              return productUpdates.push(
                API.editData("userProducts", userProductId, userProductPatchObj)
              )
            }

          })
          return Promise.all(productUpdates)
          .then(() => {
            let userCocktail = this.state.userCocktails.find(userCocktail => userCocktail.id === c.cocktailId)
            return API.editData("userCocktails", userCocktail.id, {makeCount: userCocktail.makeCount + c.quantity})
          })
          .then(() => API.deleteData("userTab", c.id))
        } else {
          alert(`You don't have enough of an ingredient to make ${c.cocktail.name}.`)
        }

      })
  }

  makeCocktails = (cocktailsToMake) => {
    let madeCocktails = []
    cocktailsToMake.forEach(c => {
      madeCocktails.push(
        this.makeCocktail(c)
      )
    })
    return Promise.all(madeCocktails)
      .then(() => this.getUserInventory())
      .then(() => this.getUserTab())
  }

  componentDidMount() {
    this.getCocktailData()
    .then(() => this.getUserInventory())
    .then(() => this.getShoppingList())
    .then(() => this.getUserTab())
    .then(() => this.setState({isLoaded: true}))

    //If a new cocktail was just created, show the success message
    if(this.props.location.hasOwnProperty('successMessage')) {
      this.toggleSuccessMessage(this.props.location.successMessage)
    }
  }

  render() {

    /* cocktails contains the ingredient Ids
     * userCocktail contains the id needed for delete
     * and creating the keys for the ListGroupItems
     * cocktailIngredients contains the ingredient labels
     * userInventory contains the users inventory data for comparing to cocktail ingredients
     */

    let {
      cocktails,
      userCocktails,
      userShoppingList,
      cocktailIngredients,
      userInventory } = this.state

    if(this.state.isLoaded) {
      return (
        <Container>
          <Row className="pt-5">

            <Col md={8}>
              <Row className="mb-5">
                <Col className="d-flex">
                  <div>
                    <h1>My Cocktails</h1>
                  </div>
                  <div className="ml-auto">
                    <CocktailAddModal
                      buttonLabel="Add Cocktails"
                      getCocktailData={this.getCocktailData}
                      showSuccessMessage={this.toggleSuccessMessage} />
                    <Button tag={Link} to="/cocktails/new">New Recipe</Button>
                  </div>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col>
                  <Button onClick={this.toggleMakeable}>
                  {
                    this.state.showOnlyMakeable
                    ? "Show All My Cocktails"
                    : "Show Only Cocktails I Can Make"
                  }
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <ListGroup>
                    {
                      cocktails.map((cocktail, i) => {
                        return (
                          <CocktailItem
                            key={userCocktails[i].id}
                            cocktail={cocktail}
                            ingredients={cocktailIngredients[i]}
                            userCocktail={userCocktails[i]}
                            userInventory={userInventory}
                            userShoppingList={userShoppingList}
                            getShoppingList={this.getShoppingList}
                            getCocktailData={this.getCocktailData}
                            addToUserTab={this.addToUserTab}
                            showOnlyMakeable={this.state.showOnlyMakeable} />
                        )
                      })
                    }
                  </ListGroup>
                </Col>
              </Row>
            </Col>
            <Col>
              <BarTab
                userTab={this.state.userTab}
                getUserTab={this.getUserTab}
                makeCocktails={this.makeCocktails} />
            </Col>
          </Row>
          <AlertContainer>
            {this.state.showSuccessMessage
              ? ( <Alert type="success" headline="Successfully Added">
                    {this.state.successMessage}
                  </Alert> ) : null }
          </AlertContainer>
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