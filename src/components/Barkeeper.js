import React, { Component } from 'react'
import NavBar from "./NavBar"
import { Switch, Route, Redirect } from "react-router-dom"

import BarView from "./bar/BarView"
import ShoppingListView from "./shoppinglist/ShoppingListView"
import CocktailsView from './cocktails/CocktailsView'
import NewCocktail from './create/NewCocktail'
import Alerts from './alerts/Alerts';

// TODO: Move Alert Container to Barkeeper to make available to all views as needed

class Barkeeper extends Component {

  state = {
    showAlert: false,
    alertHeadline: "",
    alertMessage: "",
    alertType: ""
  }

  toggleAlert = (type, headline, message) => {
    this.setState({
      showAlert: true,
      alertType: type,
      alertHeadline: headline,
      alertMessage: message
    })
    setTimeout(function() {
      this.setState({
        showAlert: false,
        alertType: "",
        alertHeadline: "",
        alertMessage: ""
      })
    }.bind(this), 3000)
  }

  render() {
    return (
      <>
        <NavBar authenticate={this.props.authenticate} />
        <Switch>
          <Route exact path="/" render={() => {
            return <Redirect to ="/cocktails" />
          }} />

          <Route path="/cocktails/new" render={props => {
            return <NewCocktail {...props} toggleAlert={this.toggleAlert} />
          }} />

          <Route path="/cocktails" render={props => {
              return <CocktailsView {...props} toggleAlert={this.toggleAlert} />
          }} />

          <Route path="/bar" render={() => {
            return <BarView toggleAlert={this.toggleAlert} />
          }} />

          <Route path="/shopping-list" render={() => {
            return <ShoppingListView toggleAlert={this.toggleAlert} />
          }} />

          <Route path="/login" render={() => {
            return <Redirect to="/" />
          }} />
        </Switch>
        <Alerts
          showAlert={this.state.showAlert}
          alertHeadline={this.state.alertHeadline}
          alertMessage={this.state.alertMessage}
          alertType={this.state.alertType}
        />
      </>
    )
  }

}

export default Barkeeper