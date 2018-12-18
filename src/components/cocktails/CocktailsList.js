/**
 * Displays a list of the cocktails that match the desired query.
 */

import React, { Component } from 'react'
import { ListGroup } from "reactstrap"
import CocktailItem from './CocktailItem'

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

    return (
      <ListGroup>
        {
          cocktails.map((cocktail, i) => {
            //Find the userCocktail relationship that goes with the cocktail.
            let thisUserCocktail = userCocktailsRelations.find(userCocktail => userCocktail.cocktailId === cocktail.id)
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
  }

}

export default CocktailsList