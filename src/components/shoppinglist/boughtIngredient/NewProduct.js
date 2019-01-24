/**
 * Creates a new product when an ingredient is bought from the shopping list.
 */

import React, { Component } from 'react'
import {
  Form,
  InputGroup,
  Input,
  Button } from "reactstrap"
import UnitsDropdown from '../../create/UnitsDropdown'
import API from '../../../modules/data/API'
import user from '../../../modules/data/user'

class NewProduct extends Component {

  state = {
    newProductName: "",
    newProductSize: "",
    unitsDropdown: "",
    disableUnits: false
  }

  componentDidMount() {
    if (this.props.ingredient.liquid === false) {
      this.setState({
        unitsDropdown: "count",
        disableUnits: true
      })
    } else {
      this.setState({disableUnits: false})
    }
  }

  handleFieldChange = (e) => {
    this.setState({[e.target.id]: e.target.value || e.target.defaultValue})
  }

  createProduct = (e) => {
    e.preventDefault()

    let obj = {
      name: this.state.newProductName,
      ingredientId: this.props.ingredient.id,
      unit: this.state.unitsDropdown,
      fullAmount: Number(this.state.newProductSize),
      createdBy: user.getId()
    }

    if(this.state.unitsDropdown === "count") {
      obj.unit = "count"
      obj.fullAmount = 1
    }

    return API.saveData("products", obj)
      .then((r) => API.saveData("userProducts", {
        userId: user.getId(),
        productId: r.id,
        amountAvailable: r.fullAmount,
        quantity: this.props.item.quantity
      }))
      .then(() => {
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
            <UnitsDropdown
              isDisabled={this.state.disableUnits}
              isRequired={true}
              onChangeFn={e => this.handleFieldChange(e)} />
            <Button type="submit">Create</Button>
          </InputGroup>
        </Form>
      </div>
    )
  }

}

export default NewProduct