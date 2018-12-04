import React, { Component } from 'react'
import {
  Button,
  Input,
  FormGroup,
  Label,
  Form,
  FormFeedback } from 'reactstrap'
import "./login.scss"

class RegisterForm extends Component {

  componentWillUnmount() {
    this.props.resetFormState()
  }

  render() {

    let validPassword = this.props.passwordMatch
    let emailTaken = this.props.emailTaken
    return (
      <Form className="register-form" onSubmit={e => this.props.submitRegister(e)}>
        <h1 className="text-primary mb-3 font-weight-bold login-logo">Barkeeper</h1>
        <h6 className="mb-3 mt-5 text-success">Please make an account</h6>
        <FormGroup className="mb-3">
          <Label className="sr-only" for="loginName">Name</Label>
          <Input type="text" id="loginName" placeholder="Name" required onChange={this.props.handleFieldChange} />
          <Label className="sr-only" for="loginEmail">Email address</Label>
          <Input type="email" id="loginEmail" placeholder="Email address" required onChange={this.props.handleFieldChange} invalid={emailTaken} />
          <FormFeedback invalid>Email is taken!</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label className="sr-only" for="loginPassword">Password</Label>
          <Input
            type="password"
            id="loginPassword"
            placeholder="Password"
            required
            onChange={(e) => {
              this.props.handleFieldChange(e)
              this.props.confirmPassword(e)
            }} />
          <Label className="sr-only" for="loginPasswordConfirm">Password</Label>
          <Input
            type="password"
            id="passwordConfirm"
            placeholder="Confirm Password"
            required
            valid={validPassword}
            invalid={validPassword === null ? false : !validPassword}
            onChange={(e) => {
              this.props.handleFieldChange(e)
              this.props.confirmPassword(e)
            }}
             />
          <FormFeedback>Your passwords don&rsquo;t match</FormFeedback>
          <FormFeedback valid>Passwords match!</FormFeedback>
        </FormGroup>

        <Button color="primary" block size="lg" type="submit">Register</Button>
        <p className="mt-2">Already have any account? <span className="link" onClick={this.props.toggleForms}>Login</span></p>
      </Form>
    )
  }

}

export default RegisterForm