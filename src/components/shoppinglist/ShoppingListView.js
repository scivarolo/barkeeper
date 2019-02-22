/**
 * Renders the shopping list view
 **/

import React, { Component } from "react"
import PropTypes from "prop-types"
import {
  Button,
  Col,
  Container,
  InputGroup,
  Row,
  Spinner } from "reactstrap"
import API from "../../modules/data/data"
import ShoppingListItem from "./ShoppingListItem"
import AddProduct from "./AddProduct"
import AddIngredient from "./AddIngredient"
import "./shoppingList.scss"

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
    return API.getAll("user_shopping")
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
    return API.delete("user_shopping", userShoppingId)
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
                  <AddProduct
                    show={this.state.showAddProduct}
                    toggle={this.toggleAddProduct}
                    toggleAlert={this.props.toggleAlert}
                    shoppingList={this.state.shoppingProducts}
                    getShoppingData={this.getShoppingData} />
                  <Button className="mx-2" color="warning" onClick={this.toggleAddProduct}>
                    {this.state.showAddProduct ? "Cancel" : "Add Products"}
                  </Button>
                  <AddIngredient
                    show={this.state.showAddIngredient}
                    toggle={this.toggleAddIngredient}
                    toggleAlert={this.props.toggleAlert}
                    shoppingList={this.state.shoppingProducts}
                    getShoppingData={this.getShoppingData} />
                  <Button className="ml-2" color="warning" onClick={this.toggleAddIngredient}>
                    {this.state.showAddIngredient ? "Cancel" : "Add Ingredients"}
                  </Button>
                </InputGroup>

              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="shopping-list-grid">

                { shoppingProducts.length ?
                  shoppingProducts.map(item => {
                    return <ShoppingListItem
                      key={item.id}
                      item={item}
                      toggleAlert={this.props.toggleAlert}
                      getShoppingData={this.getShoppingData}
                      deleteItem={this.deleteItem} />
                  })
                  : (<h4>{"You don't have any items in your shopping list. Add products and ingredients."}</h4>)
                }
              </div>
            </Col>
          </Row>
        </Container>
      )
    } else {
      return (
        <Container>
          <div className="mt-5 text-center"><Spinner color="success" style={{width: "3rem", height: "3rem"}} /></div>
        </Container>
      )
    }
  }

}

export default ShoppingListView

ShoppingListView.propTypes = {
  toggleAlert: PropTypes.func.isRequired
}