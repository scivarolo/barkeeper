import React, { useEffect } from 'react'
import {
  Button,
  Input,
  Label,
  Form,
  FormGroup } from 'reactstrap'
import "./login.scss"

function LoginForm(props) {

  useEffect(() => {
    props.resetFormState()
  }, [])

  return (
    <Form className="login-form" onSubmit={e => props.submitLogin(e)}>
      <h1 className="text-primary mb-3 font-weight-bold login-logo">Barkeeper</h1>
      <h6 className="mb-3 mt-5 text-success">Please sign in</h6>

      { props.loginFailed
        ? <p className="text-danger">Login failed. Please try again.</p>
        : null
      }

      <FormGroup>
        <Label className="sr-only" for="loginUsername">Username</Label>
        <Input type="text" id="loginUsername" placeholder="Username" required onChange={e => props.handleFieldChange(e)} />
        <Label className="sr-only" for="loginPassword">Password</Label>
        <Input type="password" id="loginPassword" placeholder="Password" required onChange={e => props.handleFieldChange(e)} />
      </FormGroup>

      <Button color="primary" block size="lg" type="submit">Sign In</Button>
      <p className="mt-2">Don&rsquo;t have an account? <span className="link" onClick={props.toggleForms}>Register</span></p>
    </Form>
  )

}

export default LoginForm