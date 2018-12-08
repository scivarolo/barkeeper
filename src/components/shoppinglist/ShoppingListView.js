import React, { Component } from 'react'
import {
  Button,
  Col,
  Container,
  InputGroup,
  InputGroupAddon,
  ListGroup,
  Row, } from 'reactstrap'
import API from '../../modules/data/API'
import ShoppingListItem from './ShoppingListItem'
import AddToList from './AddToList';

// TODO: Show success alert when product added to shopping list.
// TODO: Show success alert when product is created and added to shopping list.
// TODO: Allow ingredients to be added to shopping list not just products?
// TODO: Show success alert when ingredient is added to shopping list.

class ShoppingListView extends Component {

  state = {
    shoppingProducts: [],
    isLoaded: false,
    showAddInput: false
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
  toggleAdd = () => {
    this.setState({showAddInput: !this.state.showAddInput})
  }
  deleteItem = (userShoppingId) => {
    return API.deleteData("userShopping", userShoppingId)
      .then(() => this.getShoppingData())
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
              <InputGroup>
                <AddToList show={this.state.showAddInput} toggle={this.toggleAdd} getShoppingData={this.getShoppingData} />
                <InputGroupAddon addonType="append">
                  <Button onClick={this.toggleAdd}>
                  {
                    this.state.showAddInput ? "Nevermind" : "Add Items"
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
                {
                  shoppingProducts.map(item => {
                    return <ShoppingListItem
                            key={item.id}
                            item={item}
                            deleteItem={this.deleteItem} />
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

export default ShoppingListView