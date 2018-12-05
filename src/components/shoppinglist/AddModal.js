import React from 'react';
import {
  Button,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter } from 'reactstrap';
import API from '../../modules/data/API';
import './addModal.scss';


class AddModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      products: [],
      selectedProducts: []
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  loadProducts() {
    return API.getAll("products")
      .then(products => this.setState({products: products}))
  }

  addProducts() {
    let userId = sessionStorage.getItem("id")
    let productsArray = this.state.selectedProducts
    let savePromises = productsArray.map(id => API.saveData("userShopping", {
      productId: id,
      userId: userId,
      quantity: 1
    }))
    return Promise.all(savePromises)
      .then(() => this.setState({selectedProducts: []}))
      .then(() => this.props.getShoppingData())
  }

  handleSelections(e) {
    let selectedProducts = this.state.selectedProducts
    e.target.classList.toggle("selected")
    if(e.target.classList.contains("selected")) {
      selectedProducts.push(e.target.id)
    } else {
      let index = selectedProducts.indexOf(e.target.id)
      selectedProducts.splice(index, 1)
    }
    this.setState({selectedProducts: selectedProducts})
  }

  componentDidMount() {
    this.loadProducts()
  }
  render() {
    return (
      <div>
        <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Choose Product(s) to Add</ModalHeader>
          <ModalBody>
            <ListGroup className="addProductsList">
              {
                this.state.products.map(product => {
                  return (
                    <ListGroupItem
                      key={product.id}
                      id={product.id}
                      onClick={e => this.handleSelections(e)}>
                      {product.name}
                    </ListGroupItem>
                  )
                })
              }
            </ListGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={(e) => {
                e.preventDefault()
                this.addProducts()
                this.toggle()
              }}>Add Products</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default AddModal;