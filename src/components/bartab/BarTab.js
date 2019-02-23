/**
 * Main Bar Tab component where cocktails to be made are displayed and then made.
 */

import React, { Component } from "react"
import PropTypes from "prop-types"
import {
  Button,
  Table } from "reactstrap"
import "./bartab.scss"
import BarTabCocktail from "./BarTabCocktail"
import API from "../../modules/data/data"

class BarTab extends Component {

  removeFromUserTab = (userTabId) => {
    return API.delete("user_tab", userTabId)
      .then(() => this.props.getUserTab())
  }

  componentDidUpdate(prevProps) {
    if(prevProps.userTab !== this.props.userTab) {
      return this.props.userTab.forEach(c => this.props.getTabCocktailProductChoices(c))
    }
  }

  render() {

    if (this.props.userTab && this.props.userTab.length) {

      return (
        <div className="sticky-top bartab--offset bartab__wrapper">
          <h1>Bar Tab</h1>
          <Table className="table-sm mt-4">
            <thead>
              <tr>
                <th className="col-sm-8">Cocktail</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              {
                this.props.userTab.map(tabCocktail => {
                  return <BarTabCocktail
                    key={tabCocktail.id}
                    cocktail={tabCocktail}
                    userInventory={this.props.userInventory}
                    ingredients={this.props.cocktails.find(c => c.id === tabCocktail.cocktail_id).ingredients}
                    removeFromUserTab={this.removeFromUserTab}
                    makeWithThisIngredient={this.props.makeWithThisIngredient}
                    cocktailProducts={this.props.userTabProducts[tabCocktail.id]}
                    getUserTab={this.props.getUserTab} />
                })
              }
            </tbody>
          </Table>
          <Button onClick={() => this.props.makeCocktails(this.props.userTab)}>Make Cocktails</Button>
        </div>
      )

    } else {

      return (
        <div className="sticky-top bartab--offset bartab__wrapper">
          <h1>Bar Tab</h1>
          <p>{"You don't have any cocktails in your tab right now. Add some!"}</p>
        </div>
      )

    }

  }

}

export default BarTab

BarTab.displayName = "BarTab"
BarTab.propTypes = {
  getUserTab: PropTypes.func.isRequired,
  userTab: PropTypes.array.isRequired,
  getTabCocktailProductChoices: PropTypes.func.isRequired,
  userInventory: PropTypes.array.isRequired,
  cocktails: PropTypes.array.isRequired,
  makeWithThisIngredient: PropTypes.func.isRequired,
  userTabProducts: PropTypes.object.isRequired,
  makeCocktails: PropTypes.func.isRequired
}