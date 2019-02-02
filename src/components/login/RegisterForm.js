import React, { useEffect } from 'react'
import {
  Button,
  Input,
  FormGroup,
  Label,
  Form,
  FormFeedback } from 'reactstrap'
import "./login.scss"

function RegisterForm(props) {

  useEffect(() => {
    props.resetFormState()
  }, [])

  let validPassword = props.passwordMatch

  return (
    <Form className="register-form" onSubmit={e => props.submitRegister(e)}>
      <h1 className="text-primary mb-3 font-weight-bold login-logo">Barkeeper</h1>
      <h6 className="mb-3 mt-5 text-success">Please make an account</h6>

      {
        props.registerError !== ""
        ? <h6 className="text-danger">{props.registerError}</h6>
        : null
      }

      <FormGroup className="mb-3">
        <Label className="sr-only" for="loginFirstName">First Name</Label>
        <Input type="text" id="loginFirstName" placeholder="First Name" required onChange={props.handleFieldChange} />

        <Label className="sr-only" for="loginLastName">Last Name</Label>
        <Input type="text" id="loginLastName" placeholder="Last Name" required onChange={props.handleFieldChange} />

        <Label className="sr-only" for="loginUsername">Last Name</Label>
        <Input type="text" id="loginUsername" placeholder="Username" required onChange={props.handleFieldChange} />

        <Label className="sr-only" for="loginEmail">Email address</Label>
        <Input type="email" id="loginEmail" placeholder="Email address" required onChange={props.handleFieldChange} />
      </FormGroup>
      <FormGroup>
        <Label className="sr-only" for="loginPassword">Password</Label>
        <Input
          type="password"
          id="loginPassword"
          placeholder="Password"
          required
          onChange={(e) => {
            props.handleFieldChange(e)
            props.confirmPassword(e)
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
            props.handleFieldChange(e)
            props.confirmPassword(e)
          }}
            />
        <FormFeedback>Your passwords don&rsquo;t match</FormFeedback>
        <FormFeedback valid>Passwords match!</FormFeedback>
      </FormGroup>

      <Button color="primary" block size="lg" type="submit">Register</Button>
      <p className="mt-2">Already have an account? <span className="link" onClick={props.toggleForms}>Login</span></p>
    </Form>
  )
}

export default RegisterForm