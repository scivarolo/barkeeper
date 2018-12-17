import React, { Component } from 'react'
import {
  Button,
  Container,
  Row,
  Col } from 'reactstrap'
import { Link } from 'react-router-dom'
import API from '../../modules/data/API'
import CocktailAddModal from './CocktailAddModal'
import { Alert, AlertContainer } from 'react-bs-notifier'
import user from '../../modules/data/user'
import BarTab from '../bartab/BarTab'
import Units from '../../modules/UnitConverter'
import CocktailsList from './CocktailsList';

//TODO: In state, store the expanded usersCocktails in something other than 'cocktails', maybe 'userCocktails' (now that we have userCocktailsRelations instead of userCocktails)

class CocktailsView extends Component {

  state = {
    isLoaded: false,
    allCocktails: [],
    userCocktailsRelations: [],
    userCocktails: [],
    userCocktailIngredients: [],
    cocktails: [],
    cocktailIngredients: [],
    userTab: [],
    userTabProducts: {},
    tabChoices: {},
    userInventory: [],
    userShoppingList: [],
    successMessage: "",
    showSuccessMessage: false,
    showOnlyMakeable: false,
    viewAllCocktails: false
  }

  componentDidMount() {
    this.getUserCocktailData()
    .then(() => this.getUserInventory())
    .then(() => this.getShoppingList())
    .then(() => this.getUserTab())
    .then(() => this.setState({isLoaded: true}))

    //If a new cocktail was just created, show the success message
    if(this.props.location.hasOwnProperty('successMessage')) {
      this.toggleSuccessMessage(this.props.location.successMessage)
    }
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

  loadAllCocktails = () => {
    return API.getAll("cocktails")
    .then(data => this.setState({allCocktails: data}))
  }

  getUserCocktailData = () => {
    let userId = user.getId()
    let newState = {}
    //get userCocktails
    return API.getWithExpand("userCocktails", "cocktail", userId)
    .then(userCocktails => {
      newState.userCocktailsRelations = userCocktails
      //use cocktailId to get cocktails
      let cocktailQueries = userCocktails.map(
        c => API.getWithEmbed(`cocktails/${c.cocktailId}`, "cocktailIngredients")
      )
      //each Promise returns a cocktail with cocktailIngredients embedded
      return Promise.all(cocktailQueries)
    })
    .then(cocktails => {
      newState.userCocktails = cocktails.sort((a,b) => {
        let aName = a.name.toUpperCase()
        let bName = b.name.toUpperCase();
        return (aName < bName) ? -1 : (aName > bName) ? 1 : 0;
      })

      //for each cocktail, loop through array of ingredients to build fetchs for each ingredient
      let ingredientQueries = []
      cocktails.forEach(c => {
        //build query string for getting ingredient names of each cocktail
        let queryString = c.cocktailIngredients.reduce((q, ing) => q + `&id=${ing.ingredientId}`, '').substr(1)
        ingredientQueries.push(API.getWithFilters(`ingredients`, queryString))
      })
      return Promise.all(ingredientQueries)
    })
    .then(cocktailIngredients => {
      newState.userCocktailIngredients = cocktailIngredients
    })
    .then(() => this.setState(newState))
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
    let inTab = this.state.userTab.find(tabCocktail => tabCocktail.cocktailId === cocktailId)
    if (inTab) {
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

  getTabCocktailProductChoices = (c) => {
    return API.getWithFilters("cocktailIngredients", `cocktailId=${c.cocktailId}`)
      .then((ingredients) => {
        let prodsObj = {}
        // find the products available for each ingredient
        ingredients.forEach(ingredient => {
          let prods = this.state.userInventory.filter(item => item.product.ingredientId === ingredient.ingredientId)
          prodsObj[ingredient.ingredientId] = prods
        })
        return this.setState(prevState => {
          let userTabProductsObj = Object.assign({}, prevState.userTabProducts, {[c.id]: prodsObj})
          return {userTabProducts: userTabProductsObj}
        })
      })
  }

  makeWithThisIngredient = (e, tabCocktailId, ingredientId) => {
    let obj = {
      productId: Number(e.target.value),
      tabCocktailId: Number(tabCocktailId),
      ingredientId: Number(ingredientId)
    }
    this.setState(prevState => {
      return { tabChoices: Object.assign({}, prevState.tabChoices, {[tabCocktailId]: {[ingredientId]: obj} }) }
    })

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
         */
        let productUpdates = []

        //Check if all ingredients are available
        let canMake = true
        ingredients.forEach(ingredient => {
          let prod
          //If multiple product options, and user specified one. If not, just use the first one.
          if(this.state.tabChoices[c.id] && this.state.tabChoices[c.id][ingredient.ingredientId]) {
            let productId = this.state.tabChoices[c.id][ingredient.ingredientId].productId
            prod = this.state.userInventory.find(item => item.productId === productId)
          } else {
            prod = this.state.userInventory.find(item => item.product.ingredientId === ingredient.ingredientId)
          }
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
            let prod
            //If multiple product options, and user specified one. If not, just use the first one.
            if(this.state.tabChoices[c.id] && this.state.tabChoices[c.id][ingredient.ingredientId]) {
              let productId = this.state.tabChoices[c.id][ingredient.ingredientId].productId
              prod = this.state.userInventory.find(item => item.productId === productId)
            } else {
              prod = this.state.userInventory.find(item => item.product.ingredientId === ingredient.ingredientId)
            }
            if (!prod) return this.toggleSuccessMessage(`You don't have any __ingredient__`)

            const amountNeeded = ingredient.amount * c.quantity
            const amountUnit = ingredient.unit
            const amountNeededMl = Units.convert(amountNeeded, amountUnit, "ml")
            const prodAvailable = Units.convert((prod.amountAvailable + (prod.product.fullAmount * (prod.quantity - 1))), prod.product.unit, "ml")
            const prodFullAmount = Units.convert(prod.product.fullAmount, prod.product.unit, "ml")
            const amountLeft = prodAvailable - amountNeededMl
            const quantityLeft = amountLeft / prodFullAmount
            const quantityCeil = Math.ceil(quantityLeft)
            let newAmountAvailable = amountLeft % prodFullAmount
            if(prod.product.unit !== "ml") {
              newAmountAvailable = Units.convert(newAmountAvailable, "ml", prod.product.unit)
            }

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
            let userCocktail = this.state.userCocktailsRelations.find(userCocktail => userCocktail.cocktailId === c.cocktailId)
            if(c.quantity > 1) {
              this.toggleSuccessMessage(`You made ${c.quantity} ${c.cocktail.name}s!`)
            } else {
              this.toggleSuccessMessage(`You made ${c.quantity} ${c.cocktail.name}!`)
            }
            return API.editData("userCocktails", userCocktail.id, {makeCount: userCocktail.makeCount + c.quantity})
          })
          .then(() => API.deleteData("userTab", c.id))
        } else {
          this.toggleSuccessMessage(`You're missing ingredients needed to make ${c.cocktail.name}.`)
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

  render() {

    /* cocktails contains the ingredient Ids
     * userCocktail contains the id needed for delete
     * and creating the keys for the ListGroupItems
     * cocktailIngredients contains the ingredient labels
     * userInventory contains the users inventory data for comparing to cocktail ingredients
     */

    let {
      allCocktails,
      userCocktailIngredients,
      userCocktails,
      userCocktailsRelations,
      userShoppingList,
      userInventory,
      showOnlyMakeable } = this.state

    let cocktailsToShow = userCocktails
    if(this.state.viewAllCocktails) {
      cocktailsToShow = allCocktails
    }

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
                      getUserCocktailData={this.getUserCocktailData}
                      userCocktails={this.state.userCocktailsRelations}
                      loadAllCocktails={this.loadAllCocktails}
                      allCocktails={this.state.allCocktails}
                      showSuccessMessage={this.toggleSuccessMessage} />
                    <Button color="primary" tag={Link} to="/cocktails/new">New Recipe</Button>
                  </div>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col>
                  <Button color="warning" onClick={this.toggleMakeable}>
                  {
                    this.state.showOnlyMakeable
                    ? "Show All My Cocktails"
                    : "Show Only Cocktails I Can Make"
                  }
                  </Button>
                </Col>
              </Row>

              <Row>
                <CocktailsList
                  cocktailsToShow={cocktailsToShow}
                  userCocktailIngredients={userCocktailIngredients}
                  userInventory={userInventory}
                  userCocktailsRelations={userCocktailsRelations}
                  userShoppingList={userShoppingList}
                  getShoppingList={this.getShoppingList}
                  getUserCocktailData={this.getUserCocktailData}
                  addToUserTab={this.addToUserTab}
                  showOnlyMakeable={showOnlyMakeable}
                />
              </Row>

            </Col>
            <Col>
              <BarTab
                userTab={this.state.userTab}
                getUserTab={this.getUserTab}
                userInventory={userInventory}
                cocktails={userCocktails}
                makeWithThisIngredient={this.makeWithThisIngredient}
                getTabCocktailProductChoices={this.getTabCocktailProductChoices}
                userTabProducts={this.state.userTabProducts}
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