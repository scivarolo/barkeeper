import React, { Component } from 'react'
import {
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  ListGroupItem } from 'reactstrap'
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

  prepareUpdate() {
    if(this.state.updateValue) {
      let updatedObj = {
        amountAvailable: parseInt(this.state.updateValue)
      }
    this.props.updateItemAmount(this.props.item.id, updatedObj)
    this.toggleUpdate()
    }
  }

  render() {
    let item = this.props.item
    return (
      <ListGroupItem className="mb-2" id={item.id}>
        <h4>{item.product.name}</h4>
        <p>Available: {item.amountAvailable} {item.product.unit}</p>
        <Button onClick={this.toggleUpdate}>Update</Button>
        <Button onClick={() => this.props.deleteItem(item.id)}>Delete</Button>
        { this.state.showUpdateForm
          ? <div className="updateItem">
              <InputGroup size="sm">
                <Input type="number" style={{border: "1px solid lightgray"}}
                  placeholder={item.amountAvailable} onChange={e => this.handleFieldChange(e)} />
                <InputGroupAddon addonType="append">
                  <InputGroupText>{item.product.unit}</InputGroupText>
                </InputGroupAddon>
                <InputGroupAddon addonType="append">
                  <Button onClick={e => this.prepareUpdate(e)}>Save</Button>
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