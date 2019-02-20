/**
 * Displays a list of the cocktails that match the desired query.
 */

import React, { Component } from "react"
import { ListGroup } from "reactstrap"
import CocktailItem from "./CocktailItem"

class CocktailsList extends Component {

  state = {}

  render() {

    let {
      cocktails,
      cocktailIngredients,
      userCocktailsRelations,
      userInventory,
      userShoppingList,
      showOnlyMakeable
    } = this.props

    if (cocktails.length)
      return (
        <ListGroup>
          {
            cocktails.map((cocktail, i) => {
              //Find the userCocktail relationship that goes with the cocktail.
              let thisUserCocktail = userCocktailsRelations.find(userCocktail => userCocktail.cocktail_id === cocktail.id)

              return (
                <CocktailItem
                  key={thisUserCocktail.id}
                  cocktail={cocktail}
                  ingredients={cocktailIngredients[i]}
                  userCocktail={thisUserCocktail}
                  userInventory={userInventory}
                  userShoppingList={userShoppingList}
                  getShoppingList={this.props.getShoppingList}
                  getUserCocktailData={this.props.getUserCocktailData}
                  addToUserTab={this.props.addToUserTab}
                  showOnlyMakeable={showOnlyMakeable} />
              )
            })
          }
        </ListGroup>
      )
    else {
      return (<h4>Looks like you don't have any cocktails saved! Discover some!</h4>)
    }
  }

}

export default CocktailsList