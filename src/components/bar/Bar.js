import React, { Component } from 'react'
import {
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem } from 'reactstrap'
import API from '../../modules/data/API';
import BarItem from './BarItem'

class Bar extends Component {

  state = {
    isLoaded: false,
    inventory: []
  }

  getInventoryData() {
    let userId = sessionStorage.getItem("id")
    return API.getWithExpand("userProducts", "product", userId)
    .then((inventory) => this.setState({
      inventory: inventory
    }))
  }

  deleteItem = (id) => {
    API.deleteData("userProducts", id)
    .then(() => this.getInventoryData())
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
          <Row>
            <Col>
              <h1 className="my-5">Your Bar</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <ListGroup>
                { /* List items in inventory */
                  inventory.map(item => {
                    return (
                      <BarItem key={item.id} item={item} deleteItem={this.deleteItem} />
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

export default Bar