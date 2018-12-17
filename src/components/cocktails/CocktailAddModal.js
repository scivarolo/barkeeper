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
import './cocktailAdd.scss'

class CocktailAddModal extends Component {

  constructor(props) {
    super(props)
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
      .then(() => this.props.showSuccessMessage("Cocktail was successfully added!"))
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
    this.props.loadAllCocktails()
  }

  render() {
    return (
      <>
        <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Choose Cocktails to Add</ModalHeader>
          <ModalBody>
            <ListGroup className="addProductsList">
              {
                this.props.allCocktails.map(c => {
                  if(!this.props.userCocktails.find(userC => userC.cocktailId === c.id)) {
                    return (
                      <ListGroupItem
                        key={c.id}
                        id={c.id}
                        onClick={e => this.handleSelections(e)}>
                        {c.name}
                      </ListGroupItem>
                    )
                  }
                  return null
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
      </>
    )
  }

}

export default CocktailAddModal