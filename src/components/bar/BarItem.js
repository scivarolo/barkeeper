/**
 * Component for a single item in the user's Bar Inventory
 */

import React, { Component } from 'react'
import {
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Progress,
  ListGroupItem } from 'reactstrap'
import QuantityToggles from '../utils/QuantityToggles'
import jsonAPI from '../../modules/data/API'
import './barItem.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class BarItem extends Component {

  state = {
    showUpdateForm: false,
    updateValue: "",
    totalAmount: "",
  }

  // Toggle the update form for updating the volume of a liquor
  toggleUpdate = () => {
    this.setState({
      showUpdateForm: !this.state.showUpdateForm,
      updateValue: ""
    })
  }

  handleFieldChange = (e) => {
    let val = e.target.value
    if(e.target.value > this.props.item.product.fullAmount) {
      val = this.props.item.product.fullAmount
    }
    this.setState({updateValue: val})
  }

  // Update the volume of a product
  updateItemAmount = () => {
    if(this.state.updateValue) {
      let updatedObj = {
        amountAvailable: parseInt(this.state.updateValue)
      }
      return jsonAPI.editData("userProducts", this.props.item.id, updatedObj)
        .then(() => {
          this.toggleUpdate()
          return this.props.getInventoryData()
        })
    }
  }

  deleteItem = (id) => {
    return jsonAPI.deleteData("userProducts", id)
    .then(() => this.props.getInventoryData())
  }

  increaseQuantity = () => {
    return jsonAPI.editData("userProducts", this.props.item.id, {
      quantity: this.props.item.quantity + 1
    }).then(() => this.props.getInventoryData())
  }

  decreaseQuantity = () => {
    if (this.props.item.quantity === 1) {
      return this.deleteItem(this.props.item.id)
    } else {
      return jsonAPI.editData("userProducts", this.props.item.id, {
        quantity: this.props.item.quantity - 1
      }).then(() => this.props.getInventoryData())
    }
  }

  render() {
    let item = this.props.item
    return (
      <ListGroupItem className="mb-2 bar-item" id={item.id}>
        <h4>{item.product.name} ({item.product.fullAmount} {item.product.unit})</h4>
        <div className="d-flex">
          { item.product.unit !== "count"
            ? <>
                <div style={{width: '150px'}}>
                  <Progress
                    className="item-amount-chart"
                    color={
                      (item.amountAvailable / item.product.fullAmount <= 0.25) && item.quantity === 1
                      ? "danger"
                      : "primary"}
                    value={item.amountAvailable}
                    max={item.product.fullAmount} />
                </div>
                <div className="mx-3">
                  <span>{item.amountAvailable} {item.product.unit}</span>
                  { this.state.showUpdateForm
                    ? <div className="updateItem mx-2">
                        <InputGroup size="sm">
                          <Input size="sm" type="number" min="0" step="any" max={item.product.fullAmount} value={this.state.updateValue} style={{border: "1px solid lightgray", maxWidth:"70px"}}
                            placeholder={item.amountAvailable} onChange={e => this.handleFieldChange(e)} />
                          <InputGroupAddon addonType="append">
                            <InputGroupText>{item.product.unit}</InputGroupText>
                          </InputGroupAddon>
                          <InputGroupAddon addonType="append">
                            <Button onClick={this.updateItemAmount} color="warning">
                              <FontAwesomeIcon icon="check" />
                            </Button>
                            <Button onClick={this.toggleUpdate} color="danger">
                              <FontAwesomeIcon icon="times" />
                            </Button>
                          </InputGroupAddon>
                        </InputGroup>
                      </div>
                    : <FontAwesomeIcon icon="pen" className="mx-2 bar-edit-icon"
                        onClick={this.toggleUpdate} />
                  }
                </div>
              </>
            : null
          }
          <div className={item.product.unit === "count" ? "mr-auto" : "ml-auto"}>
            <span className="d-flex">
              <span>Quantity: {item.quantity}</span>
              <QuantityToggles increase={this.increaseQuantity} decrease={this.decreaseQuantity} />
            </span>
          </div>
          <div className="ml-2">
            <FontAwesomeIcon icon="trash" className="bar-item-delete" onClick={() => this.deleteItem(item.id)} />
          </div>
        </div>
      </ListGroupItem>
    )
  }

}

export default BarItem