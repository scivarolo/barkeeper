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
import API from '../../modules/data/API'
import './barItem.scss'

class BarItem extends Component {

  state = {
    showUpdateForm: false,
    updateValue: "",
    totalAmount: "",
  }

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

  updateItemAmount = () => {
    if(this.state.updateValue) {
      let updatedObj = {
        amountAvailable: parseInt(this.state.updateValue)
      }
      return API.editData("userProducts", this.props.item.id, updatedObj)
        .then(() => {
          this.toggleUpdate()
          return this.props.getInventoryData()
        })
    }
  }

  totalProductAmount = (item) => {
    if(item.quantity === 1) {
      return this.setState({totalAmount: item.amountAvailable})
    }
    if(item.quantity > 1) {
      let totalAmount = item.amountAvailable + (item.product.fullAmount * (item.quantity - 1))
      return this.setState({totalAmount: totalAmount})
    }
  }

  deleteItem = (id) => {
    return API.deleteData("userProducts", id)
    .then(() => this.props.getInventoryData())
  }

  increaseQuantity = () => {
    return API.editData("userProducts", this.props.item.id, {
      quantity: this.props.item.quantity + 1
    }).then(() => this.props.getInventoryData())
  }

  decreaseQuantity = () => {
    if (this.props.item.quantity === 1) {
      return this.deleteItem(this.props.item.id)
    } else {
      return API.editData("userProducts", this.props.item.id, {
        quantity: this.props.item.quantity - 1
      }).then(() => this.props.getInventoryData())
    }
  }

  componentDidMount() {
    this.totalProductAmount(this.props.item)
  }

  render() {
    let item = this.props.item
    return (
      <ListGroupItem className="mb-2" id={item.id}>
        <h4>{item.product.name} ({item.product.fullAmount} {item.product.unit})</h4>
        <div className="d-flex">
          <div className="mr-3">
            <span className="d-flex">
              <span>Quantity: {item.quantity}</span>
              <QuantityToggles increase={this.increaseQuantity} decrease={this.decreaseQuantity} />
            </span>
          </div>
          <div className="mr-3">
            <span>Available: {item.amountAvailable} {item.product.unit}</span>
          </div>
          <div style={{width: '150px'}}>
            <Progress className="item-amount-chart" value={item.amountAvailable} max={item.product.fullAmount} />
          </div>
          <div className="ml-auto">
            { this.state.showUpdateForm
              ? <div className="updateItem mr-2">
                  <InputGroup size="sm">
                    <Input type="number" min="0" step="any" max={item.product.fullAmount} value={this.state.updateValue} style={{border: "1px solid lightgray", maxWidth:"70px"}}
                      placeholder={item.amountAvailable} onChange={e => this.handleFieldChange(e)} />
                    <InputGroupAddon addonType="append">
                      <InputGroupText>{item.product.unit}</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupAddon addonType="append">
                      <Button onClick={this.updateItemAmount}>Save</Button>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
              : null
            }
            <Button outline color="warning" size="sm" className="mr-2" onClick={this.toggleUpdate}>
              {this.state.showUpdateForm ? "Cancel" : "Update"}
            </Button>
            <Button outline color="danger" size="sm" onClick={() => this.deleteItem(item.id)}>Delete</Button>
          </div>
        </div>
      </ListGroupItem>
    )
  }

}

export default BarItem