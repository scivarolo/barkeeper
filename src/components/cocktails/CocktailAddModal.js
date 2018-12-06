import React, { Component } from 'react'
import {
  Button,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter } from 'reactstrap'
import API from '../../modules/data/API'

class CocktailAddModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      cocktails: [],
      selectedCocktails: []
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  loadCocktails() {
    return API.getAll("cocktails")
    .then(cocktails => this.setState({cocktails: cocktails}))
  }

  addCocktails() {
    let userId = sessionStorage.getItem("id")
    let cocktailsArray = this.state.selectedCocktails
    let savePromises = cocktailsArray.map(id => API.saveData("userCocktails", {
      userId: parseInt(userId),
      cocktailId: parseInt(id),
      wantToMake: false,
      makeCount: 0
    }))
    return Promise.all(savePromises)
      .then(() => this.setState({selectedProducts: []}))
      .then(() => this.props.getCocktailData())
  }

  handleSelections(e) {
    let selected = this.state.selectedCocktails
    e.target.classList.toggle("selected")
    if(e.target.classList.contains("selected")) {
      selected.push(e.target.id)
    } else {
      let index = selected.indexOf(e.target.id)
      selected.splice(index, 1)
    }
    this.setState({selecteProducts: selected})
  }

  componentDidMount() {
    this.loadCocktails()
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
                this.state.cocktails.map(c => {
                  return (
                    <ListGroupItem
                      key={c.id}
                      id={c.id}
                      onClick={e => this.handleSelections(e)}>
                      {c.name}
                    </ListGroupItem>
                  )
                })
              }
            </ListGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={e => {
              e.preventDefault()
              this.addCocktails()
              this.toggle()
            }}>Add Cocktail(s)</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }

}

export default CocktailAddModal