import React, { Component } from 'react'
import {
  Button,
  Container,
  Row,
  Col,
  InputGroup,
  ListGroup } from 'reactstrap'
import API from '../../modules/data/API'
import user from '../../modules/data/user'
import BarItem from './BarItem'
import AddToBar from './AddToBar'

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
            <Col className="d-flex" md={4}>
                <h1>Your Bar</h1>
            </Col>
            <Col md={8}>
                <InputGroup className="d-flex">
                  <AddToBar show={this.state.showAddInput}
                    toggle={this.toggleAdd}
                    inventory={this.state.inventory}
                    getInventoryData={this.getInventoryData}
                    toggleAlert={this.props.toggleAlert} />

                  <Button onClick={this.toggleAdd} color="warning" className="ml-auto">
                    {
                      this.state.showAddInput ? "Cancel" : "Add Products"
                    }
                  </Button>
                </InputGroup>
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