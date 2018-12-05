import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import API from '../../modules/data/API'
class ShoppingList extends Component {

  state = {
    shoppingProducts: [],
    isLoaded: false
  }

  componentDidMount() {
    let userId = sessionStorage.getItem("id")
    return API.getWithExpand("userShopping", "product", userId)
    .then(items => {
      this.setState({
        shoppingProducts: items,
        isLoaded: true
      })
    })
  }

  render() {

    let shoppingProducts = this.state.shoppingProducts

    if (this.state.isLoaded) {
      return (
        <Container>
          <Row>
            <Col>
              <h1>Shopping List</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <ul>
                {
                  shoppingProducts.map(item => {
                    return <li key={item.id}>{item.product.name}</li>
                  })
                }
              </ul>
            </Col>
          </Row>
        </Container>
      )
    } else {
      return (
        <Container>
          <Row>
            <Col>
              <div>Loading</div>
            </Col>
          </Row>
        </Container>
      )
    }
  }

}

export default ShoppingList