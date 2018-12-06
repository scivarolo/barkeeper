import React, { Component } from 'react';
import NavBar from "./NavBar";
import { Switch, Route, Redirect } from "react-router-dom"

import Dashboard from "./dashboard/Dashboard"
import BarView from "./bar/BarView"
import ShoppingListView from "./shoppinglist/ShoppingListView"
import CocktailsView from './cocktails/CocktailsView';

class Barkeeper extends Component {

  render() {
    return (
      <>
        <NavBar />
        <Switch>
          <Route exact path="/" render={() => {
              return <Dashboard />
          }} />

          <Route path="/cocktails" render={() => {
              return <CocktailsView />
          }} />

          <Route path="/bar" render={() => {
            return <BarView />
          }} />

          <Route path="/shopping-list" render={() => {
            return <ShoppingListView />
          }} />

          <Route path="/login" render={() => {
            return <Redirect to="/" />
          }} />
        </Switch>
      </>
    )
  }

}

export default Barkeeper