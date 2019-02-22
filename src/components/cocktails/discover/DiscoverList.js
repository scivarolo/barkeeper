/**
 * Displays a list of the cocktails that the user has not added.
 */

import React, { Component } from "react"
import PropTypes from "prop-types"
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

      if (cocktails.length) {
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
        return (<h4>You saved every cocktail! How about adding a new recipe?</h4>)
      }

    } else {
      return <div>Loading</div>
    }
  }

}

export default DiscoverList

DiscoverList.propTypes = {
  getDiscoverCocktails: PropTypes.func.isRequired,
  cocktails: PropTypes.array.isRequired,
  cocktailIngredients: PropTypes.array.isRequired,
  getUserCocktailData: PropTypes.func.isRequired,
  allMinusUserCocktails: PropTypes.func.isRequired
}

