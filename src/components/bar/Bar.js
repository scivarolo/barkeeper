import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import API from '../../modules/data/API';

class Bar extends Component {

  state = {
    isLoaded: false,
    inventory: []
  }

  componentDidMount() {
    let userId = sessionStorage.getItem("id")
    API.getWithExpand("userProducts", "product", userId)
    .then((inventory) => this.setState({
      inventory: inventory,
      isLoaded: true
    }))
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
            <ul>
              { /* List items in inventory */
                inventory.map(item => {
                  return (
                    <li key={item.id}>
                      <h6>{item.product.name}</h6>
                      <p>Available: {item.amountAvailable}{item.product.unit}</p>
                    </li>
                  )
                })
              }
            </ul>
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