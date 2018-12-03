import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import Dashboard from './dashboard/Dashboard';
import Cocktails from './cocktails/Cocktails';
import Bar from './bar/Bar';
import ShoppingList from './shoppinglist/ShoppingList';
import NavBar from './NavBar';
import Login from './login/Login';

class App extends Component {

  state = {
    isAuthenticated: true
  }

  isAuthenticated() {
    // TODO: Check sessionStorage or localStorage for authentication
    return this.state.isAuthenticated
  }

  render() {
    return (
      <>
      { this.isAuthenticated()
      ? <NavBar /> : null }

      <Switch>
        <Route exact path="/" render={() => {
          if(this.isAuthenticated())
            return <Dashboard />
            return <Redirect to="/login" />
        }} />

        <Route path="/cocktails" render={() => {
          if(this.isAuthenticated())
            return <Cocktails />
            return <Redirect to="/login" />
          }} />

        <Route path="/bar" render={() => {
          if(this.isAuthenticated())
          return <Bar />
          return <Redirect to="/login" />
          }} />

        <Route path="/shopping-list" render={() => {
          if(this.isAuthenticated())
          return <ShoppingList />
          return <Redirect to="/login" />
        }} />
        <Route path="/login" render={() => {
          if(!this.isAuthenticated())
          return <Login />
          return <Redirect to="/" />
          }} />
      </Switch>
      </>
    );
  }
}

export default App;
