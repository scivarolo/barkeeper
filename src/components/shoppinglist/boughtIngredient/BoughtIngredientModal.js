/**
 * Modal for when an ingredient was "bought" from the shopping list.
 * Let's user choose an existing product to add to their inventory
 * Or create a new product.
 */

import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import API from '../../../modules/data/API';
import NewProduct from './NewProduct';

//TODO: replace with Typeahead to filter existing products and create a new one from there.

class BoughtIngredientModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      productsOfIngredient: [],
      newProduct: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  getIngredientProducts = (ingredientId) => {
    API.getWithFilters("products", `ingredientId=${ingredientId}`)
      .then(data => this.setState({productsOfIngredient: data}))
  }

  componentDidMount() {
    this.getIngredientProducts(this.props.ingredient.id)
  }

  componentDidUpdate(prevProps) {
    if(!prevProps.ingredientId === this.props.ingredientId) {
      this.getIngredientProducts(this.props.ingredientId)
    }
  }

  render() {
    return (
      <>
        <Button outline color="warning" size="sm" onClick={this.toggle}>{this.props.buttonLabel}</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Add {this.props.ingredient.label} Product</ModalHeader>
          <ModalBody>
            { this.state.newProduct
              ? <NewProduct
                  item={this.props.item}
                  ingredient={this.props.ingredient}
                  toggle={this.toggle}
                  deleteItem={() => this.props.deleteItem(this.props.item.id)} />
              : this.state.productsOfIngredient.map(product => {
                return <Button
                          key={product.id}
                          block
                          onClick={() => {
                            this.props.boughtIngredientProduct(product, this.props.item)
                            this.toggle()
                          }}
                          className="mb-2 text-left">{product.name}</Button>
              })
            }
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => this.setState({newProduct: true})}>New Product</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default BoughtIngredientModal