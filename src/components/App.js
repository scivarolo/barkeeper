/**
 * Checks if a user is authenticated, if not redirect to login.
 */

import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Login from './login/Login';
import Barkeeper from './Barkeeper';
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPlusCircle,
  faMinusCircle,
  faEdit,
  faTrash,
  faCheckCircle,
  faCheck,
  faCartPlus,
  faPen,
  faTimes,
  faChevronUp,
  faChevronDown,
  faBookmark } from '@fortawesome/free-solid-svg-icons'

library.add(faPlusCircle, faMinusCircle, faEdit, faTrash, faCheckCircle, faCartPlus, faBookmark, faTimes, faCheck, faPen, faChevronUp, faChevronDown)
class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: () => {
        if (window.localStorage.getItem("token")) {
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
    if (window.localStorage.getItem("token")) {
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
      ? <Barkeeper authenticate={this.authenticate} />
      : <>
          <Redirect to="/login" />
          <Login authenticate={this.authenticate} />
        </>
      }
      </>
    );
  }
}

export default App;
