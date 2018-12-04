import React, { Component } from 'react';
import NavBar from "./NavBar";
import { Switch, Route, Redirect } from "react-router-dom"

import Dashboard from "./dashboard/Dashboard"
import Cocktails from "./cocktails/Cocktails"
import Bar from "./bar/Bar"
import ShoppingList from "./shoppinglist/ShoppingList"

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
              return <Cocktails />
          }} />

          <Route path="/bar" render={() => {
            return <Bar />
          }} />

          <Route path="/shopping-list" render={() => {
            return <ShoppingList />
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