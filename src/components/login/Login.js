import React, { Component } from 'react'
import { Container } from 'reactstrap'
import "./login.scss"

import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import API from '../../modules/data/API';

class Login extends Component {

  state = {
    loginEmail: "",
    loginPassword: "",
    loginName: "",
    rememberMe: false,
    loginForm: true,
    passwordConfirm: "",
    passwordMatch: null,
    registerSuccess: false,
    loginFailed: false,
    emailTaken: false
  }

  // Toggle between Login and Register
  toggleForms = () => {
    this.setState({loginForm: !this.state.loginForm})
  }

  // Save input values to state
  handleFieldChange = (e) => {
    if (e.target.type === "checkbox") {
      this.setState({rememberMe: !this.state.rememberMe})
    } else {
      this.setState({[e.target.id]: e.target.value})
    }
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

    this.setState({passwordMatch: match})
  }

  submitLogin = (e) => {
    e.preventDefault()
    // Check if email and password match a user in the database
    return API.query("users", this.state.loginEmail)
      .then(user => {
        if(user.length && user[0].password === this.state.loginPassword) {
          this.setState({loginFailed: false})
          window.sessionStorage.setItem("id", user[0].id)
          this.props.authenticate()
        } else {
          this.setState({loginFailed: true})
        }
      })
  }

  submitRegister = (e) => {
    e.preventDefault()

    // If passwords don't match stop
    if(!this.state.passwordMatch) {
      return
    }

    //Set up object for submission to database
    let newUser = {
      email: this.state.loginEmail,
      password: this.state.loginPassword,
      name: this.state.loginName
    }

    // Check if email is in use
    return API.query("users", this.state.loginEmail)
      .then(existing => {
        if(existing.length) {
          return this.setState({emailTaken: true})
        } else {
          return API.saveData("users", newUser)
          .then(() => {
            this.toggleForms()
            this.setState({registerSuccess: true})
          })
        }
      })

  }

  // Clear form data from state when either is unmounted
  resetFormState = () => {
    this.setState({
      loginEmail: "",
      loginPassword: "",
      loginName: "",
      rememberMe: false
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
            registerSuccess={this.state.registerSuccess}
            loginFailed={this.state.loginFailed} />
          :
          <RegisterForm
            toggleForms={this.toggleForms}
            handleFieldChange={this.handleFieldChange}
            resetFormState={this.resetFormState}
            confirmPassword={this.confirmPassword}
            submitRegister={this.submitRegister}
            passwordMatch={this.state.passwordMatch}
            emailTaken={this.state.emailTaken} />
        }
      </Container>
    )
  }

}

export default Login