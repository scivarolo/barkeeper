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
import AddProduct from './AddProduct'
import AddIngredient from './AddIngredient'

// TODO: Show success alert when product added to shopping list.
// TODO: Show success alert when product is created and added to shopping list.
// TODO: Show success alert when ingredient is added to shopping list.
// TODO: Ability to create Ingredient on the fly.
// TODO: Ability to create Product on the fly.

class ShoppingListView extends Component {

  state = {
    shoppingProducts: [],
    isLoaded: false,
    showAddProduct: false,
    showAddIngredient: false
  }

  getShoppingData = () => {
    let userId = sessionStorage.getItem("id")
    return API.getWithExpands("userShopping", userId, "product", "ingredient")
    .then(items => {
      this.setState({
        shoppingProducts: items,
        isLoaded: true
      })
    })
  }

  toggleAddProduct = () => {
    this.setState({showAddProduct: !this.state.showAddProduct})
  }

  toggleAddIngredient = () => {
    this.setState({showAddIngredient: !this.state.showAddIngredient})
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
                <AddProduct show={this.state.showAddProduct} toggle={this.toggleAddProduct} getShoppingData={this.getShoppingData} />
                <Button className="mx-2" onClick={this.toggleAddProduct}>
                  {this.state.showAddProduct ? "Cancel" : "Add Products"}
                </Button>
                <AddIngredient show={this.state.showAddIngredient} toggle={this.toggleAddIngredient} getShoppingData={this.getShoppingData} />
                <Button className="ml-2" onClick={this.toggleAddIngredient}>
                  {this.state.showAddIngredient ? "Cancel" : "Add Ingredients"}
                </Button>
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