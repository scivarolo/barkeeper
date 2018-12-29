import React, { Component } from 'react'
import {
  Button,
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  ListGroup } from 'reactstrap'
import API from '../../modules/data/API'
import user from '../../modules/data/user'
import BarItem from './BarItem'
import AddToBar from './AddToBar'
import { Alert, AlertContainer } from 'react-bs-notifier'

class BarView extends Component {

  state = {
    inventory: [],
    isLoaded: false,
    showAddInput: false,
  }

  getInventoryData = () => {
    let userId = user.getId()
    return API.getWithExpand("userProducts", "product", userId)
    .then(inventory => {
      let sortedArray = inventory.sort(function(a, b) {
        let textA = a.product.name.toUpperCase()
        let textB = b.product.name.toUpperCase()
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
      })
      return sortedArray
    })
    .then(inventory => this.setState({
      inventory: inventory
    }))
  }

  toggleAdd = () => {
    this.setState({showAddInput: !this.state.showAddInput})
  }

  componentDidMount() {
    this.getInventoryData()
    .then(() => this.setState({isLoaded: true}))
  }

  render() {
    let inventory = this.state.inventory

    if(this.state.isLoaded) {
      return (
        <Container>
          <Row className="my-5">
            <Col className="d-flex">
              <div>
                <h1>Your Bar</h1>
              </div>
              <div className="ml-auto">
                <InputGroup>
                  <AddToBar show={this.state.showAddInput}
                    toggle={this.toggleAdd}
                    inventory={this.state.inventory}
                    getInventoryData={this.getInventoryData}
                    toggleAlert={this.props.toggleAlert} />
                  <InputGroupAddon addonType="append">
                    <Button onClick={this.toggleAdd}>
                    {
                      this.state.showAddInput ? "Nevermind" : "Add Products"
                    }
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <ListGroup>
                { /* List items in inventory */
                  inventory.map(item => {
                    return (
                      <BarItem
                        key={item.id}
                        item={item}
                        getInventoryData={this.getInventoryData} />
                    )
                  })
                }
              </ListGroup>
            </Col>
          </Row>
        </Container>
      )
    }
    else {
      return (
        <Container>
          <div>Loading</div>
        </Container>
      )
    }
  }

}

export default BarView