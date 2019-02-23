import React, { Component } from "react"
import PropTypes from "prop-types"
import { Container } from "reactstrap"
import "./login.scss"

import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"

class Login extends Component {

  state = {
    loginEmail: "",
    loginPassword: "",
    loginUsername: "",
    loginFirstName: "",
    loginLastName: "",
    loginForm: true,
    passwordConfirm: "",
    passwordMatch: null,
    loginFailed: false,
    registerError: "",
  }

  // Toggle between Login and Register
  toggleForms = () => {
    this.setState({loginForm: !this.state.loginForm})
  }

  // Save input values to state
  handleFieldChange = (e) => {
    this.setState({[e.target.id]: e.target.value})
  }

  confirmPassword = (e) => {
    let match = null

    /*
     * Checks if passwords match
     * but only if there are characters in both fields
     */

    if(e.target.id === "loginPassword") {
      if(e.target.value === this.state.passwordConfirm) {
        match = true
      } else {
        match = false
      }
    }

    if(e.target.id === "passwordConfirm") {
      if(e.target.value === this.state.loginPassword) {
        match = true
      } else {
        match = false
      }
    }

    if (this.state.passwordConfirm.length === 0 || this.state.loginPassword.length === 0 || e.target.value.length === 0) {
      match = null
    }

    this.setState({
      passwordMatch: match
    })
  }

  // Grab the username and password and send it to postAuth for Django to authenticate
  submitLogin = (e) => {
    e.preventDefault()
    const user = {
      username: this.state.loginUsername,
      password: this.state.loginPassword
    }
    this.postAuth("api/api-token-auth", user)
  }


  // Handles sending login and registration to Django
  // and sending back the Token or error.
  postAuth(route, user) {

    return fetch(`https://barkeeper-api.sebastiancivarolo.com/${route}/`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then((tokenObj) => {
        if (tokenObj.token) {
          window.localStorage.setItem("token", tokenObj.token)
          window.localStorage.setItem("user_id", tokenObj.user_id)
        } else {
          this.setState({loginFailed: true})
        }
        this.props.authenticate()
      })
      .catch(() => {
        this.setState({registerError: "Username already in use."})
      })
  }

  registerDjango = (e) => {
    e.preventDefault()
    const new_user = {
      username: this.state.loginUsername,
      first_name: this.state.loginFirstName,
      last_name: this.state.loginLastName,
      email: this.state.loginEmail,
      password: this.state.loginPassword
    }
    this.postAuth("accounts/register", new_user)
  }

  // Clear form data from state when either is unmounted
  resetFormState = () => {
    this.setState({
      loginEmail: "",
      loginFirstName: "",
      loginLastName: "",
      loginUsername: "",
      loginPassword: "",
      passwordConfirm: "",
    })
  }

  render() {

    return (

      <Container className="login-container text-center">
        { /* Display login or register */
          this.state.loginForm
            ?
            <LoginForm
              toggleForms={this.toggleForms}
              handleFieldChange={this.handleFieldChange}
              resetFormState={this.resetFormState}
              submitLogin={this.submitLogin}
              loginFailed={this.state.loginFailed} />
            :
            <RegisterForm
              toggleForms={this.toggleForms}
              handleFieldChange={this.handleFieldChange}
              resetFormState={this.resetFormState}
              confirmPassword={this.confirmPassword}
              submitRegister={this.registerDjango}
              passwordMatch={this.state.passwordMatch}
              registerError={this.state.registerError} />
        }
      </Container>
    )
  }
}

export default Login

Login.displayName = "Login"
Login.propTypes = {
  authenticate: PropTypes.func.isRequired
}