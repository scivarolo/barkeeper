import React, { Component } from 'react'
import {
  Form,
  InputGroup,
  Input,
  Button
  } from "reactstrap";
import UnitsDropdown from '../../create/UnitsDropdown';
import API from '../../../modules/data/API';
import user from '../../../modules/data/user';

class NewProduct extends Component {

  state = {
    newProductName: "",
    newProductIngredient: "",
    newProductSize: "",
    unitsDropdown: ""
  }

  handleFieldChange = (e) => {
    this.setState({[e.target.id]: e.target.value || e.target.defaultValue})
  }

  handleTypeaheadChange = (selected) => {
    let invalid = false
    if(!selected.length) {
      invalid = true
    }
    this.setState({
      newProductIngredient: selected,
      typeaheadInvalid: invalid
    })
  }

  createProduct = (e) => {
    e.preventDefault()

    let obj = {
      name: this.state.newProductName,
      ingredientId: this.props.ingredient.id,
      unit: this.state.unitsDropdown,
      fullAmount: this.state.newProductSize,
      createdBy: user.getId()
    }
    return API.saveData("products", obj)
      .then((r) => API.saveData("userProducts", {
        userId: user.getId(),
        productId: r.id,
        amountAvailable: r.fullAmount,
        quantity: this.props.item.quantity
      }))
      .then(() => {
        // this.props.toggleSuccessMessage(`${this.state.newProductName} successfully created and added to your bar`)
        this.props.toggle()
        this.props.deleteItem()
      })
  }

  render() {
    return (
      <div>
        <h6>Create New Product</h6>
        <Form onSubmit={e => this.createProduct(e)}>
          <InputGroup>
            <Input
              id="newProductName"
              type="text"
              onChange={e => this.handleFieldChange(e)} />
            <Input
              required
              id="newProductSize"
              type="number"
              onChange={e => this.handleFieldChange(e)}
              placeholder="Size" />
            <UnitsDropdown isRequired={true} onChangeFn={e => this.handleFieldChange(e)} />
            <Button type="submit">Create</Button>
          </InputGroup>
        </Form>
      </div>
    )
  }

}

export default NewProduct