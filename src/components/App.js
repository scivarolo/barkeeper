import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import Login from './login/Login';
import Barkeeper from './Barkeeper';

class App extends Component {

  state = {
    isAuthenticated: false
  }

  isAuthenticated() {
    // TODO: Check sessionStorage or localStorage for authentication
    return this.state.isAuthenticated
  }

  authenticate = () => {
    if(window.sessionStorage.getItem("id"))
      this.setState({isAuthenticated: true})
  }

  componentDidMount() {
    this.authenticate()
  }

  render() {

    return (
      <>
      { this.isAuthenticated()
      ? <Barkeeper />
      : <>
          <Redirect to="/login" />
          <Login
            authenticate={this.authenticate} />
        </>
      }
      </>
    );
  }
}

export default App;
