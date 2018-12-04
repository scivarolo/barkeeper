import React, { Component } from 'react'
import {
  Button,
  Input,
  Label,
  Form,
  FormGroup } from 'reactstrap'
import "./login.scss"

class LoginForm extends Component {
  componentWillUnmount() {
    this.props.resetFormState()
  }

  render() {
    return (
      <Form className="login-form" onSubmit={e => this.props.submitLogin(e)}>
        <h1 className="text-primary mb-3 font-weight-bold login-logo">Barkeeper</h1>
        <h6 className="mb-3 mt-5 text-success">Please sign in</h6>
        { this.props.registerSuccess
          ? <p className="text-success">Your account was created successfully! Please log in.</p>
          : null
        }
        { this.props.loginFailed
          ? <p className="text-danger">Login failed. Please try again.</p>
          : null
        }

        <FormGroup>
          <Label className="sr-only" for="loginEmail">Email address</Label>
          <Input type="email" id="loginEmail" placeholder="Email address" required onChange={this.props.handleFieldChange} />
          <Label className="sr-only" for="loginPassword">Password</Label>
          <Input type="password" id="loginPassword" placeholder="Password" required onChange={this.props.handleFieldChange} />
        </FormGroup>
        <div className="checkbox my-3">
          <Label><Input type="checkbox" value="remember-me" onChange={this.props.handleFieldChange} />Remember Me</Label>
        </div>
        <Button color="primary" block size="lg" type="submit">Sign In</Button>
        <p className="mt-2">Don&rsquo;t have any account? <span className="link" onClick={this.props.toggleForms}>Register</span></p>
      </Form>
    )
  }

}

export default LoginForm