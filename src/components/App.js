import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import Dashboard from './dashboard/Dashboard';
import Cocktails from './cocktails/Cocktails';
import Bar from './bar/Bar';
import ShoppingList from './shoppinglist/ShoppingList';
import NavBar from './NavBar';
import Login from './login/Login';

class App extends Component {

  render() {
    return (
      <>
      <NavBar />
      <Switch>
        <Route path="/login" component={Login} />
        <Route exact path="/" component={Dashboard} />
        <Route path="/cocktails" component={Cocktails} />
        <Route path="/bar" component={Bar} />
        <Route path="/shopping-list" component={ShoppingList} />
      </Switch>
      </>
    );
  }
}

export default App;
