import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import Login from './login/Login';
import Barkeeper from './Barkeeper';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: () => {
        if(window.sessionStorage.geItem("id")) {
          return true
        } else {
          return false
        }
      }
    }
  }

  isAuthenticated() {
    return this.state.isAuthenticated
  }

  authenticate = () => {
    if(window.sessionStorage.getItem("id")) {
      this.setState({isAuthenticated: true})
    } else {
      this.setState({isAuthenticated: false})
    }
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
