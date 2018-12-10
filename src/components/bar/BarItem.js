import React, { Component } from 'react'
import {
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  ListGroupItem } from 'reactstrap'
import API from '../../modules/data/API';
// import API from '../../modules/data/API';

class BarItem extends Component {

  state = {
    showUpdateForm: false,
    updateValue: ""
  }

  toggleUpdate = () => {
    this.setState({
      showUpdateForm: !this.state.showUpdateForm,
      updateValue: ""
    })
  }

  handleFieldChange = (e) => {
    this.setState({updateValue: e.target.value})
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

  componentDidMount() {
    this.totalProductAmount(this.props.item)
  }

  render() {
    let item = this.props.item
    return (
      <ListGroupItem className="mb-2" id={item.id}>
        <h4>{item.product.name}</h4>
        <p>Available: {item.amountAvailable} {item.product.unit}</p>
        <p>Quantity: {item.quantity}</p>
        <Button size="sm" onClick={this.toggleUpdate}>Update</Button>
        <Button size="sm" onClick={() => this.deleteItem(item.id)}>Delete</Button>
        { this.state.showUpdateForm
          ? <div className="updateItem">
              <InputGroup size="sm">
                <Input type="number" style={{border: "1px solid lightgray"}}
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
      </ListGroupItem>
    )
  }

}

export default BarItem