/**
 * While adding Product to inventory from inventory view.
 * If new product is triggered, this is the form to create it.
 */

import React, { Component } from "react"
import PropTypes from "prop-types"
import {
  Form,
  InputGroup,
  Input,
  Button } from "reactstrap"
import { Typeahead } from "react-bootstrap-typeahead"
import "react-bootstrap-typeahead/css/Typeahead.css"
import "react-bootstrap-typeahead/css/Typeahead-bs4.css"
import UnitsDropdown from "./UnitsDropdown"
import API from "../../modules/data/data"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

//TODO: Allow new ingredient to be created when a new product is being created.

class NewProduct extends Component {

  state = {
    ingredients: [],
    newProductName: "",
    newProductIngredient: "",
    newProductSize: "",
    unitsDropdown: "",
    typeaheadInvalid: true
  }

  componentDidMount() {
    API.getAll("ingredients")
      .then(ingredients => this.setState({ingredients: ingredients}))
  }

  handleFieldChange = (e) => {
    this.setState({[e.target.id]: e.target.value || e.target.defaultValue})
  }

  handleTypeaheadChange = (selected) => {
    let newState = {
      newProductIngredient: selected,
      typeaheadInvalid: false,
      disableUnits: false
    }
    if(!selected.length) {
      newState.typeaheadInvalid = true
    }
    if(selected.length && selected[0].liquid === false) {
      newState.disableUnits = true
      newState.unitsDropdown = "count"
    }
    this.setState(newState)
  }

  createProduct = (e) => {
    e.preventDefault()
    if(this.state.typeaheadInvalid) {
      return
    }

    let obj = {
      name: this.state.newProductName,
      ingredient: this.state.newProductIngredient[0].id,
      unit: this.state.unitsDropdown,
      size: Number(this.state.newProductSize),
    }

    if(this.state.unitsDropdown === "count") {
      obj.unit = "count"
      obj.size = 1
    }

    return API.save("products", obj)
      .then(r => {
        let quantity = 1
        if (this.state.unitsDropdown === "count") {
          quantity = Number(this.state.newProductSize)
        }
        return API.save("user_products", {
          product_id: r.id,
          quantity: quantity,
          amount_available: r.size
        })
      })
      .then(() => this.props.getInventory())
      .then(() => this.props.loadProducts())
      .then(() => {
        this.props.toggleAlert("success", "Product Created", `${this.state.newProductName} successfully created and added to your bar.`)
        this.props.toggle()
      })
  }

  render() {
    return (
      <div className="my-3" style={{width: "100%"}}>
        <h6>Create New Product</h6>
        <Form onSubmit={e => this.createProduct(e)}>
          <InputGroup>
            <Input
              id="newProductName"
              type="text"
              autoFocus
              onFocus={e => this.handleFieldChange(e)}
              onChange={e => this.handleFieldChange(e)}
              defaultValue={this.props.product.name} />
            <Typeahead
              isInvalid={this.state.typeaheadInvalid}
              id="newProductIngredient"
              labelKey="name"
              placeholder="Type"
              onChange={selected => this.handleTypeaheadChange(selected)}
              options={this.state.ingredients} />
            <Input
              required
              id="newProductSize"
              type="number"
              onChange={e => this.handleFieldChange(e)}
              placeholder="Size" />
            <UnitsDropdown
              isRequired={true}
              isDisabled={this.state.disableUnits}
              onChangeFn={e => this.handleFieldChange(e)} />
            <Button type="submit" color="warning">
              <FontAwesomeIcon icon="check" />
            </Button>
            <Button onClick={this.props.toggle} color="danger">
              <FontAwesomeIcon icon="times" />
            </Button>
          </InputGroup>
        </Form>
      </div>
    )
  }

}

export default NewProduct

NewProduct.propTypes = {
  getInventory: PropTypes.func.isRequired,
  loadProducts: PropTypes.func.isRequired,
  toggleAlert: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
}