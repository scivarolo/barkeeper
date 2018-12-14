import React, { Component } from 'react'
import {
  Button,
  Table } from 'reactstrap'
import './bartab.scss'
import BarTabCocktail from './BarTabCocktail'
import API from '../../modules/data/API'

class BarTab extends Component {

  state = {

  }

  removeFromUserTab = (userTabId) => {
    return API.deleteData("userTab", userTabId)
      .then(() => this.props.getUserTab())
  }

  componentDidMount() {
    return this.props.userTab.forEach(c => this.props.getTabCocktailProductChoices(c))
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
                            ingredients={this.props.cocktails.find(c => c.id === tabCocktail.cocktailId).cocktailIngredients}
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
          <p>{`You don't have any cocktails in your tab right now. Add some!`}</p>
        </div>
      )

    }

  }

}

export default BarTab