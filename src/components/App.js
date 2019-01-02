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
  faBookmark} from '@fortawesome/free-solid-svg-icons'

library.add(faPlusCircle, faMinusCircle, faEdit, faTrash, faCheckCircle, faCartPlus, faBookmark, faTimes, faCheck, faPen)
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
      ? <Barkeeper authenticate={this.authenticate} />
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
