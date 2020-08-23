/**
 * Modal for when an ingredient was "bought" from the shopping list.
 * Let's user choose an existing product to add to their inventory
 * Or create a new product.
 */

import React, { Component } from "react"
import PropTypes from "prop-types"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import API from "../../../modules/data/data"
import NewProduct from "./NewProduct"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

class BoughtIngredientModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modal: false,
      productsOfIngredient: [],
      newProduct: false
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    })
  }

  getIngredientProducts = (ingredientId) => {
    API.getFiltered("products", `ingredient=${ingredientId}`)
      .then(data => this.setState({productsOfIngredient: data}))
  }

  componentDidMount() {
    this.getIngredientProducts(this.props.ingredient.id)
  }

  render() {
    return (
      <>
        <FontAwesomeIcon
          icon="check"
          className="ml-2 shopping-bought"
          onClick={this.toggle} />
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Add {this.props.ingredient.name} Product</ModalHeader>
          <ModalBody>
            { this.state.newProduct
              ? <NewProduct
                item={this.props.item}
                ingredient={this.props.ingredient}
                toggle={this.toggle}
                deleteItem={() => this.props.deleteItem(this.props.item.id)} />
              : this.state.productsOfIngredient.length
                ? this.state.productsOfIngredient.map(product => {
                  return <Button
                    key={product.id}
                    block
                    onClick={() => {
                      this.props.boughtIngredientProduct(product, this.props.item)
                      this.props.toggleAlert("success", `${product.name} Added To Inventory`, "Go make a cocktail!")
                      this.toggle()
                    }}
                    className="mb-2 text-left">{product.name}</Button>
                })
                : "There are no products in the database matching this ingredient. Add a new product."
            }
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => this.setState({newProduct: true})}>New Product</Button>{" "}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }
}

export default BoughtIngredientModal

BoughtIngredientModal.displayName = "BoughtIngredientModal"
BoughtIngredientModal.propTypes = {
  ingredient: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  deleteItem: PropTypes.func.isRequired,
  boughtIngredientProduct: PropTypes.func.isRequired,
  toggleAlert: PropTypes.func.isRequired
}