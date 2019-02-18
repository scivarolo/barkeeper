import React, { Component } from "react"
import PropTypes from "prop-types"
import {
  Button,
  Container,
  Row,
  Col } from "reactstrap"
import { Link } from "react-router-dom"
import API from "../../modules/data/data"
import user from "../../modules/data/user"
import BarTab from "../bartab/BarTab"
import Units from "../../modules/UnitConverter"
import CocktailsList from "./CocktailsList"
import DiscoverList from "./discover/DiscoverList"
import CocktailSearch from "./CocktailSearch"
import IngredientFilter from "./IngredientFilter"

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
    return API.getAll("cocktails")
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

    let ingredients = this.getIngredientData(filtered)

    return this.setState({
      allMinusUserCocktails: filtered,
      allMinusUserCocktailIngredients: ingredients
    })

  }

  /* for use after a fetch. Doesn't set state, so set it in the appropriate function. */
  getIngredientData = (cocktails) => {
    let ingredients = []
    // TODO: Use the integrated ingredients rather than the separate ingredients object.
    //build ingredients as separate state object (remnant from json-server)
    cocktails.forEach(c => {
      ingredients.push(c.ingredients)
    })
    return ingredients
  }

  getDiscoverCocktails = () => {
    return this.loadAllCocktails()
      .then(() => this.allMinusUserCocktails())
  }

  getUserCocktailData = () => {
    /* Load the user's cocktails, and load the cocktail data with the IDs from that array. */
    let newState = {}

    // get user_cocktails
    return API.getAll("user_cocktails")
      .then(userCocktails => {
        newState.userCocktailsRelations = userCocktails
        //use 'cocktail' from user_cocktail to get cocktail data
        let cocktailQueries = userCocktails.map(
          c => API.getOne("cocktails", c.cocktail_id)
        )
        //each Promise returns a cocktail with cocktailIngredients embedded
        return Promise.all(cocktailQueries)
      })
      .then(cocktails => {
        newState.userCocktails = cocktails

        // Loops through cocktails and saves ingredients in state as a separate array
        // Remnant from using json-server, but now the cocktail returns all of the ingredient data inside it.
        // TODO: Rewrite anywhere that uses userCocktailIngredients to just reference the ingredients from within the cocktail
        let cocktailIngredients = []
        cocktails.forEach(cocktail => {
          cocktailIngredients.push(cocktail.ingredients)
        })
        return cocktailIngredients
      })
      .then(cocktailIngredients => {
        newState.userCocktailIngredients = cocktailIngredients
      })
      .then(() => this.setState(newState))
  }

  getUserInventory() {
    return API.getAll("user_products")
      .then(data => this.setState({userInventory: data}))
  }

  getShoppingList = () => {
    return API.getAll("user_shopping")
      .then(data => this.setState({userShoppingList: data}))
  }

  getUserTab = () => {
    // Loads the user tab data and gets the product choices if applicable.
    return API.getAll("user_tab")
      .then(data => {
        data.forEach(cocktail => this.getTabCocktailProductChoices(cocktail))
        return this.setState({userTab: data})
      })
  }

  addToUserTab = (cocktailId) => {
    let inTab = this.state.userTab.find(tabCocktail => tabCocktail.cocktail_id === cocktailId)

    if (inTab) {
      let obj = {
        quantity: inTab.quantity + 1
      }
      return API.edit("user_tab", inTab.id, obj)
        .then(() => this.getUserTab())
    }

    // else not already in tab
    let obj = {
      cocktail_id: cocktailId,
      quantity: 1
    }
    return API.save("user_tab", obj)
      .then(() => this.getUserTab())
  }

  getTabCocktailProductChoices = (c) => {

    let prodsObj = {}
    // find the products available for each ingredient
    c.cocktail.ingredients.forEach(ingredient => {
      let prods = this.state.userInventory.filter(item => item.product.ingredient === ingredient.ingredient.id)
      prodsObj[ingredient.ingredient.id] = prods
    })
    return this.setState(prevState => {
      let userTabProductsObj = Object.assign({}, prevState.userTabProducts, {[c.id]: prodsObj})
      return {userTabProducts: userTabProductsObj}
    })
  }

  makeWithThisIngredient = (e, tabCocktailId, ingredientId) => {
    let obj = {
      productId: Number(e.target.value),
      tabCocktailId: Number(tabCocktailId),
      ingredientId: Number(ingredientId)
    }
    // For each ingredient, save the product choice inside an object for that tabCocktail inside tabChoices in state
    return this.setState(prevState => {
      let tabChoicesObj = Object.assign({}, prevState.tabChoices, {
        [tabCocktailId]: Object.assign({}, prevState.tabChoices[tabCocktailId], {
          [ingredientId]: obj
        })
      })
      return {
        tabChoices: tabChoicesObj
      }
    })

  }

  makeCocktail = (c) => {
    // c = the bar tab cocktail being made
    let ingredients = c.cocktail.ingredients
    let productUpdates = []
    let canMake = true

    // Check if each ingredient is available
    ingredients.forEach(currentIngredient => {
      let prod
      // Check if user has specified any non-default choices for products to use to make this cocktail
      if (this.state.tabChoices[c.id] && this.state.tabChoices[c.id][currentIngredient.ingredient.id]) {
        let productId = this.state.tabChoices[c.id][currentIngredient.ingredient.id].productId
        prod = this.state.userInventory.find(item => item.product_id === productId)
      } else {
        prod = this.state.userInventory.find(item => item.product.ingredient === currentIngredient.ingredient.id)
      }
      // If no product found, cannot make cocktail
      if (!prod) {
        canMake = false
        return
      }

      // Check if there is enough of each ingredient to make the specified quantity
      const amountNeededMl = Units.convert((currentIngredient.amount * c.quantity), currentIngredient.unit, "ml")
      const prodAvailable = Units.convert((prod.amount_available + (prod.product.size * prod.quantity)), prod.product.unit, "ml")
      const amountLeft = prodAvailable - amountNeededMl
      if (amountLeft < 0) canMake = false
    })

    if (canMake) {
      ingredients.forEach(currentIngredient => {
        let prod
        if (this.state.tabChoices[c.id] && this.state.tabChoices[c.id][currentIngredient.ingredient.id]) {
          let productId = this.state.tabChoices[c.id][currentIngredient.ingredient.id].productId
          prod = this.state.userInventory.find(item => item.product_id === productId)
        } else {
          prod = this.state.userInventory.find(item => item.product.ingredient === currentIngredient.ingredient.id)
        }
        if (!prod) return this.props.toggleAlert("Warning", "Can't Make This Cocktail", "You're missing ingredients!")

        const amountNeededMl = Units.convert((currentIngredient.amount * c.quantity), currentIngredient.unit, "ml")
        const prodAvailable = Units.convert((prod.amount_available + (prod.product.size * prod.quantity)), prod.product.unit, "ml")
        const prodSizeMl = Units.convert(prod.product.size, prod.product.unit, "ml")
        const amountLeft = prodAvailable - amountNeededMl
        const quantityLeft = Math.ceil(amountLeft / prodSizeMl)

        let newAmountAvailable = amountLeft % prodSizeMl
        if (newAmountAvailable === 0) {
          newAmountAvailable = prodSizeMl
        }
        if (prod.product.unit !== "ml" && prod.product.unit !== "count") {
          newAmountAvailable = Units.convert(newAmountAvailable, "ml", prod.product.unit)
        }

        const userProductId = prod.id
        const userProductPatchObj = {
          amount_available: Math.round(newAmountAvailable),
          quantity: quantityLeft
        }

        if (amountLeft < 0) {
          return this.props.toggleAlert("warning", "Bummer", "You don't have enough of an ingredient to make this many.")
        } else if (amountLeft === 0) {
          return productUpdates.push(
            API.delete("user_products", userProductId)
          )
        } else {
          return productUpdates.push(
            API.edit("user_products", userProductId, userProductPatchObj)
          )
        }
      })
      return Promise.all(productUpdates)
        .then(() => {
          let userCocktail = this.state.userCocktailsRelations.find(userCocktail => userCocktail.cocktail_id === c.cocktail_id)
          if (c.quantity > 1) {
            this.props.toggleAlert("success", "Enjoy!", `You made ${c.quantity} ${c.cocktail.name}s!`)
          } else {
            this.props.toggleAlert("success", "Enjoy!", `You made ${c.quantity} ${c.cocktail.name}!`)
          }
          return API.edit("user_cocktails", userCocktail.id, {make_count: userCocktail.make_count + c.quantity})
        }).then(() => API.delete("user_tab", c.id))
    } else {
      this.props.toggleAlert("warning", "Bummer", `You're missing ingredients needed to make ${c.cocktail.name}.`)
    }
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
      if(cocktail.ingredients.find(cocktailIngredient => cocktailIngredient.ingredient.id === ingredientId)) {
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
                    <h1>{this.state.discoverCocktails ? "Discover" : "My Cocktails"}</h1>
                  </div>
                  <div className="ml-auto">
                    <Button color="warning" onClick={this.toggleDiscover}>{!this.state.discoverCocktails ? "Discover" : "My Cocktails"}</Button>
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

CocktailsView.propTypes = {
  toggleAlert: PropTypes.func.isRequired
}