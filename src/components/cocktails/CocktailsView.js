import React, { Component } from 'react'
import {
  Button,
  Container,
  Row,
  Col } from 'reactstrap'
import { Link } from 'react-router-dom'
import jsonAPI from '../../modules/data/API'
import user from '../../modules/data/user'
import BarTab from '../bartab/BarTab'
import Units from '../../modules/UnitConverter'
import CocktailsList from './CocktailsList'
import DiscoverList from './discover/DiscoverList'
import CocktailSearch from './CocktailSearch'
import IngredientFilter from './IngredientFilter'

class CocktailsView extends Component {

  state = {
    userId: user.getId(),
    isLoaded: false,
    allCocktails: [],
    allIngredients: [],
    allMinusUserCocktails: [],
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
    showOnlyMakeable: false,
    discoverCocktails: false,
    searching: false,
    filtering: false,
    searchResults: []
  }

  componentDidMount() {
    this.getUserCocktailData()
    .then(() => this.getUserInventory())
    .then(() => this.getShoppingList())
    .then(() => this.getUserTab())
    .then(() => this.setState({isLoaded: true}))
  }

  toggleMakeable = () => {
    this.setState({showOnlyMakeable: !this.state.showOnlyMakeable})
  }

  toggleDiscover = () => {
    /* Switches between user's cocktails and cocktail discover */
    this.cocktailSearch.clear()
    this.cocktailFilter.clear()
    this.setState({
      //reset search results when switching view
      searching: false,
      filtering: false,
      searchResults: [],
      searchIngredients: [],
      discoverCocktails: !this.state.discoverCocktails
    })
  }

  loadAllCocktails = () => {
    return jsonAPI.getWithEmbed("cocktails", "cocktailIngredients")
    .then(data => this.setState({allCocktails: data}))
  }

  allMinusUserCocktails = () => {
    let filtered = this.state.allCocktails.filter(cocktail => {
      if(!this.state.userCocktails.find(userC => userC.id === cocktail.id)) {
        return cocktail
      } else {
        return null
      }
    })

    filtered.sort((a, b) => {
      let aName = a.name.toUpperCase()
      let bName = b.name.toUpperCase()
      return (aName < bName) ? -1 : (aName > bName) ? 1 : 0
    })
    return this.getIngredientData(filtered)
    .then((ingredients) => this.setState({
      allMinusUserCocktails: filtered,
      allMinusUserCocktailIngredients: ingredients
    })
    )
  }

  /* for use after a fetch. Doesn't set state, so set it in the appropriate function. */
  getIngredientData = (cocktails) => {
    let ingredients = []
    cocktails.forEach(c => {
      //build query string for getting ingredient names of each cocktail
      let queryString = c.cocktailIngredients.reduce((q, ing) => q + `&id=${ing.ingredientId}`, '').substr(1)
      ingredients.push(jsonAPI.getWithFilters(`ingredients`, queryString))
    })
    return Promise.all(ingredients)
  }

  getDiscoverCocktails = () => {
    return this.loadAllCocktails()
    .then(() => this.allMinusUserCocktails())
  }

  getUserCocktailData = () => {
    let newState = {}
    //get userCocktails
    return jsonAPI.getWithExpand("userCocktails", "cocktail", this.state.userId)
    .then(userCocktails => {
      newState.userCocktailsRelations = userCocktails
      //use cocktailId to get cocktails
      let cocktailQueries = userCocktails.map(
        c => jsonAPI.getWithEmbed(`cocktails/${c.cocktailId}`, "cocktailIngredients")
      )
      //each Promise returns a cocktail with cocktailIngredients embedded
      return Promise.all(cocktailQueries)
    })
    .then(cocktails => {
      newState.userCocktails = cocktails.sort((a,b) => {
        let aName = a.name.toUpperCase()
        let bName = b.name.toUpperCase()
        return (aName < bName) ? -1 : (aName > bName) ? 1 : 0
      })

      //for each cocktail, loop through array of ingredients to build fetchs for each ingredient
      let ingredientQueries = []
      cocktails.forEach(c => {
        //build query string for getting ingredient names of each cocktail
        let queryString = c.cocktailIngredients.reduce((q, ing) => q + `&id=${ing.ingredientId}`, '').substr(1)
        ingredientQueries.push(jsonAPI.getWithFilters(`ingredients`, queryString))
      })
      return Promise.all(ingredientQueries)
    })
    .then(cocktailIngredients => {
      newState.userCocktailIngredients = cocktailIngredients
    })
    .then(() => this.setState(newState))
  }

  getUserInventory() {
    jsonAPI.getWithExpand("userProducts", "product", this.state.userId)
    .then(data => this.setState({userInventory: data}))
  }

  getShoppingList = () => {
    jsonAPI.getWithExpands("userShopping", this.state.userId, "product", "ingredient")
    .then(data => this.setState({userShoppingList: data}))
  }

  getUserTab = () => {
    jsonAPI.getWithExpands("userTab", this.state.userId, "cocktail")
    .then(data => this.setState({userTab: data}))
  }

  addToUserTab = (cocktailId) => {
    let inTab = this.state.userTab.find(tabCocktail => tabCocktail.cocktailId === cocktailId)

    if (inTab) {
      let obj = {
        quantity: inTab.quantity + 1
      }
      return jsonAPI.editData("userTab", inTab.id, obj)
      .then(() => this.getUserTab())
    }

    // else not already in tab
    let obj = {
      userId: user.getId(),
      cocktailId: cocktailId,
      quantity: 1
    }
    return jsonAPI.saveData("userTab", obj)
    .then(() => this.getUserTab())
  }

  getTabCocktailProductChoices = (c) => {
    return jsonAPI.getWithFilters("cocktailIngredients", `cocktailId=${c.cocktailId}`)
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
      return {
        tabChoices: Object.assign({}, prevState.tabChoices, {
          [tabCocktailId]: {
            [ingredientId]: obj
          }
        })
      }
    })

  }

  makeCocktail = (c) => {
    // c = the cocktail being made
    return jsonAPI.getWithFilters("cocktailIngredients", `cocktailId=${c.cocktailId}`)
      .then((ingredients) => {
        /**
         * Loop through each of the cocktail's ingredients
         * Find the first product in the inventory that matches
         * and calculate how much will be left.
         * Return all updates in a Promise.all
         */
        let productUpdates = []

        // Check if all ingredients are available
        let canMake = true
        ingredients.forEach(ingredient => {
          let prod
          // If multiple product options, and user specified one. Else, use the first one.
          if(this.state.tabChoices[c.id] && this.state.tabChoices[c.id][ingredient.ingredientId]) {
            let productId = this.state.tabChoices[c.id][ingredient.ingredientId].productId
            prod = this.state.userInventory.find(item => item.productId === productId)
          } else {
            prod = this.state.userInventory.find(item => item.product.ingredientId === ingredient.ingredientId)
          }
          // If no product found, then cannot make it
          if (!prod) {
            canMake = false
            return
          }

          // Check if there is enough of each ingredient to make the specified quantity.
          const amountNeeded = ingredient.amount * c.quantity
          const amountUnit = ingredient.unit
          const amountNeededMl = Units.convert(amountNeeded, amountUnit, "ml")
          const prodAvailable = Units.convert((prod.amountAvailable + (prod.product.fullAmount * prod.quantity)), prod.product.unit, "ml")

          const amountLeft = prodAvailable - amountNeededMl
          if (amountLeft < 0) {
            canMake = false
          }
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
            if (!prod) return this.props.toggleAlert("Warning", "Can't Make This Cocktail", `You're missing ingredients!`)

            const amountNeeded = ingredient.amount * c.quantity
            const amountUnit = ingredient.unit
            const amountNeededMl = Units.convert(amountNeeded, amountUnit, "ml")
            const prodAvailable = Units.convert((prod.amountAvailable + (prod.product.fullAmount * (prod.quantity - 1))), prod.product.unit, "ml")
            const prodFullAmount = Units.convert(prod.product.fullAmount, prod.product.unit, "ml")
            const amountLeft = prodAvailable - amountNeededMl
            const quantityLeft = amountLeft / prodFullAmount
            const quantityCeil = Math.ceil(quantityLeft)
            let newAmountAvailable = amountLeft % prodFullAmount
            if (newAmountAvailable === 0) {
              newAmountAvailable = prodFullAmount
            }
            if (prod.product.unit !== "ml" && prod.product.unit !== "count") {
              newAmountAvailable = Units.convert(newAmountAvailable, "ml", prod.product.unit)
            }

            const userProductId = prod.id
            const userProductPatchObj = {
              amountAvailable: newAmountAvailable,
              quantity: quantityCeil
            }

            if (amountLeft < 0) {
              return this.props.toggleAlert("warning", "Bummer", `You don't have enough of an ingredient to make this many.`)
            } else if (amountLeft === 0) {
              return productUpdates.push(
                jsonAPI.deleteData("userProducts", userProductId)
              )
            } else {
              return productUpdates.push(
                jsonAPI.editData("userProducts", userProductId, userProductPatchObj)
              )
            }

          })
          return Promise.all(productUpdates)
          .then(() => {
            let userCocktail = this.state.userCocktailsRelations.find(userCocktail => userCocktail.cocktailId === c.cocktailId)
            if (c.quantity > 1) {
              this.props.toggleAlert("success", "Enjoy!", `You made ${c.quantity} ${c.cocktail.name}s!`)
            } else {
              this.props.toggleAlert("success", "Enjoy!", `You made ${c.quantity} ${c.cocktail.name}!`)
            }
            return jsonAPI.editData("userCocktails", userCocktail.id, {makeCount: userCocktail.makeCount + c.quantity})
          })
          .then(() => jsonAPI.deleteData("userTab", c.id))
        } else {
          this.props.toggleAlert("warning", "Bummer", `You're missing ingredients needed to make ${c.cocktail.name}.`)
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

  searchCocktails = (cocktailsToSearch, ingredientsToSearch, query) => {
    query = query.toLowerCase()
    let searching = true
    let ingredientResults = []
    let results = cocktailsToSearch.filter((result, index) => {
      let found = result.name.toLowerCase().includes(query)
      if (found) ingredientResults.push(ingredientsToSearch[index])
      return found
    })

    if (query === "") {
      results = []
      ingredientResults = []
      searching = false
    }
    return this.setState({
      searching: searching,
      filtering: false,
      searchIngredients: ingredientResults,
      searchResults: results
    })
  }

  filterByIngredient = (cocktailsToFilter, cocktailIngredients, ingredientId) => {
    if (ingredientId === "noFilter") {
      return this.setState({
        filtering: false,
        searching: false,
        searchResults: [],
        searchIngredients: []
      })
    }

    this.cocktailSearch.clear()
    let matchingIngredients = []
    let results = cocktailsToFilter.filter((cocktail, i) => {
      if(cocktail.cocktailIngredients.find(cocktailIngredient => cocktailIngredient.ingredientId === ingredientId)) {
        matchingIngredients.push(cocktailIngredients[i])
        return cocktail
      } else {
        return null
      }
    })
    return this.setState({
      filtering: true,
      searching: false,
      searchResults: results,
      searchIngredients: matchingIngredients
    })
  }

  render() {

    /* cocktails contains the ingredient Ids
     * userCocktail contains the id needed for delete
     * and creating the keys for the ListGroupItems
     * cocktailIngredients contains the ingredient labels
     * userInventory contains the users inventory data for comparing to cocktail ingredients
     */

    let {
      allMinusUserCocktails,
      allMinusUserCocktailIngredients,
      discoverCocktails,
      userCocktailIngredients,
      userCocktails,
      userCocktailsRelations,
      userShoppingList,
      userInventory,
      searching,
      filtering,
      searchResults,
      searchIngredients,
      showOnlyMakeable } = this.state

    let cocktailsToShow = userCocktails
    let ingredientsToShow = userCocktailIngredients
    let cocktailsToSearch = userCocktails
    let ingredientsToSearch = userCocktailIngredients

    if (discoverCocktails) {
      cocktailsToShow = allMinusUserCocktails
      ingredientsToShow = allMinusUserCocktailIngredients
      cocktailsToSearch = allMinusUserCocktails
      ingredientsToSearch = allMinusUserCocktailIngredients
    }
    if (searching || filtering) {
      cocktailsToShow = searchResults
      ingredientsToShow = searchIngredients
    }


    if (this.state.isLoaded) {
      return (
        <Container fluid>
          <Row className="pt-5">
            <Col md={2}>
              <CocktailSearch
                ref={cocktailSearch => this.cocktailSearch = cocktailSearch}
                searchData={cocktailsToSearch}
                searchIngredients={ingredientsToSearch}
                searching={searching}
                search={this.searchCocktails}
                searchResults={searchResults}
                placeholder="Filter Cocktails" />
              <IngredientFilter
                ref={cocktailFilter => this.cocktailFilter = cocktailFilter}
                cocktails={cocktailsToSearch}
                cocktailIngredients={ingredientsToSearch}
                filterByIngredient={this.filterByIngredient}
              />
            </Col>
            <Col md={7}>
              <Row className="mb-5">
                <Col className="d-flex">
                  <div>
                    <h1>{this.state.discoverCocktails ? `Discover` : `My Cocktails`}</h1>
                  </div>
                  <div className="ml-auto">
                    <Button color="warning" onClick={this.toggleDiscover}>{!this.state.discoverCocktails ? `Discover` : `My Cocktails`}</Button>
                    <Button color="primary" tag={Link} to="/cocktails/new">New Recipe</Button>
                  </div>
                </Col>
              </Row>
                {this.state.discoverCocktails
                ? null
                : <Row className="mb-4">
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
                }

              <Row>
                <Col>
                {
                  this.state.discoverCocktails
                  ? <DiscoverList
                      cocktails={cocktailsToShow}
                      cocktailIngredients={ingredientsToShow}
                      getDiscoverCocktails={this.getDiscoverCocktails}
                      getUserCocktailData={this.getUserCocktailData}
                      userCocktails={userCocktails}
                      allMinusUserCocktails={this.allMinusUserCocktails}
                    />
                  : <CocktailsList
                      cocktails={cocktailsToShow}
                      cocktailIngredients={ingredientsToShow}
                      userInventory={userInventory}
                      userCocktailsRelations={userCocktailsRelations}
                      userShoppingList={userShoppingList}
                      getShoppingList={this.getShoppingList}
                      getUserCocktailData={this.getUserCocktailData}
                      addToUserTab={this.addToUserTab}
                      showOnlyMakeable={showOnlyMakeable}
                    />
                }
                { ((searching || filtering) && !searchResults.length)
                  ? (discoverCocktails)
                    ? <>
                        <h1>No cocktails match your search.</h1>
                        <p>Want to add a <a href="cocktails/new">new cocktail recipe</a>?</p>
                      </>
                    : <>
                        <h1>No cocktails found in your list.</h1>
                        <p>Perhaps try searching in <Button onClick={this.toggleDiscover}>Discover Cocktails</Button>?</p>
                      </>
                  : null

                }
                </Col>
              </Row>

            </Col>
            <Col md={3}>
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