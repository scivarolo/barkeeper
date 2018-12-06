/* This component renders an input field with a save button
 * that can be used when an ingredient does not exist
 * in the database, but is needed for the current step
 */

import React, { Component } from 'react';
import {
  Button,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText } from "reactstrap";
import API from '../../modules/data/API';
import user from '../../modules/data/user';

class NewIngredient extends Component {

  state = {
    label: ""
  }

  handleFieldChange(e) {
    this.setState({label: e.target.value})
  }

  addIngredient = () => {
    let obj = {
      label: this.state.label,
      createdBy: user.getId()
    }
    return API.saveData("ingredients", obj)
    .then(() => this.props.toggle())
  }

  render() {

    if(this.props.show) {
      return (
        <InputGroup size="sm">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>Label</InputGroupText>
          </InputGroupAddon>
          <Input type="text" onChange={e => this.handleFieldChange(e)} />
          <InputGroupAddon addonType="append">
            <Button onClick={this.addIngredient}>Save</Button>
            <Button onClick={this.props.toggle}>Cancel</Button>
          </InputGroupAddon>
        </InputGroup>
      )
    } else {
      return null
    }
  }

}

export default NewIngredient