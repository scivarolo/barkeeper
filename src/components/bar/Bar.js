import React, { Component } from 'react'
import {
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem } from 'reactstrap'
import API from '../../modules/data/API';

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
              <h1>Your Bar</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <ListGroup>
                { /* List items in inventory */
                  inventory.map(item => {
                    return (
                      <ListGroupItem className="mb-2" key={item.id}>
                        <h4>{item.product.name}</h4>
                        <p>Available: {item.amountAvailable}{item.product.unit}</p>
                      </ListGroupItem>
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