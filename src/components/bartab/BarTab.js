import React, { Component } from 'react'
import {
  Table } from 'reactstrap'
import './bartab.scss'
import BarTabCocktail from './BarTabCocktail';
import API from '../../modules/data/API';

class BarTab extends Component {

  state = {

  }

  removeFromUserTab = (userTabId) => {
    return API.deleteData("userTab", userTabId)
      .then(() => this.props.getUserTab())
  }

  render() {

    if (this.props.userTab && this.props.userTab.length) {

      return (
        <div className="sticky-top bartab--offset bartab__wrapper">
          <h1>Bar Tab</h1>
          <Table>
            <thead>
              <tr>
                <th>Cocktail</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              {
                this.props.userTab.map(tabCocktail => {
                  return <BarTabCocktail
                            cocktail={tabCocktail}
                            removeFromUserTab={this.removeFromUserTab}
                            getUserTab={this.props.getUserTab} />
                })
              }
            </tbody>
          </Table>
        </div>
      )

    } else {

      return (
        <div className="sticky-top bartab--offset bartab__wrapper">
          <h1>Bar Tab</h1>
          <p>You don't have any cocktails in your tab right now. Add some!</p>
        </div>
      )

    }

  }

}

export default BarTab