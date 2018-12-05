import React, { Component } from 'react'
import {
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Row, } from 'reactstrap'
import API from '../../modules/data/API'

import AddModal from './AddModal';

class ShoppingList extends Component {

  state = {
    shoppingProducts: [],
    isLoaded: false
  }

  getShoppingData = () => {
    let userId = sessionStorage.getItem("id")
    return API.getWithExpand("userShopping", "product", userId)
    .then(items => {
      this.setState({
        shoppingProducts: items,
        isLoaded: true
      })
    })
  }

  componentDidMount() {
    this.getShoppingData()
    .then(() => this.setState({isLoaded: true}))
  }

  render() {

    let shoppingProducts = this.state.shoppingProducts

    if (this.state.isLoaded) {
      return (
        <Container>
          <Row className="my-5">
            <Col className="d-flex">
              <div>
                <h1>Shopping List</h1>
              </div>
              <div className="ml-auto">
                <AddModal
                  buttonLabel="Add Product"
                  getShoppingData={this.getShoppingData} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <ListGroup>
                {
                  shoppingProducts.map(item => {
                    return <ListGroupItem className="mb-2" key={item.id}>{item.product.name}</ListGroupItem>
                  })
                }
              </ListGroup>
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