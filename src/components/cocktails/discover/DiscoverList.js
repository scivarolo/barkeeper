/**
 * Displays a list of the cocktails that the user has not added.
 */

import React, { Component } from "react"
import { ListGroup } from "reactstrap"
import DiscoverItem from "./DiscoverItem"

class DiscoverList extends Component {

  state = {
    loaded: false
  }

  componentDidMount() {
    this.props.getDiscoverCocktails()
      .then(() => this.setState({loaded: true}))
  }

  render() {

    let {
      cocktails,
      cocktailIngredients
    } = this.props

    if (this.state.loaded) {

      return (
        <ListGroup>
          {
            cocktails.map((cocktail, i) => {
              return (
                <DiscoverItem
                  key={cocktail.id}
                  cocktail={cocktail}
                  ingredients={cocktailIngredients[i]}
                  getUserCocktailData={this.props.getUserCocktailData}
                  allMinusUserCocktails={this.props.allMinusUserCocktails}
                />
              )
            })
          }
        </ListGroup>
      )
    } else {
      return <div>Loading</div>
    }
  }

}

export default DiscoverList