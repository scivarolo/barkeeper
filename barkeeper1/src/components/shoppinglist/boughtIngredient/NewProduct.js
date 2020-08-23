/**
 * Creates a new product when an ingredient is bought from the shopping list.
 */

import React, { Component } from "react"
import PropTypes from "prop-types"
import {
  Form,
  InputGroup,
  Input,
  Button } from "reactstrap"
import UnitsDropdown from "../../create/UnitsDropdown"
import API from "../../../modules/data/data"

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
      ingredient: this.props.ingredient.id,
      unit: this.state.unitsDropdown,
      size: Number(this.state.newProductSize),
    }

    if(this.state.unitsDropdown === "count") {
      obj.unit = "count"
      obj.size = 1
    }

    return API.save("products", obj)
      .then((r) => API.save("user_products", {
        product_id: r.id,
        amount_available: r.size,
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

NewProduct.displayName = "NewProduct"
NewProduct.propTypes = {
  ingredient: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired
}