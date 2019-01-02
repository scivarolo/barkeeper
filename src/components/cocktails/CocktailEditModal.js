import React from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter } from 'reactstrap'
import EditCocktail from '../create/EditCocktail'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class CocktailEditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <>
        <FontAwesomeIcon className="cocktail-edit ml-3" icon="edit" onClick={this.toggle} />
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Edit {this.props.cocktail.name}</ModalHeader>
          <ModalBody>
            <EditCocktail cocktail={this.props.cocktail}
              ingredientNames={this.props.ingredientNames}
              getUserCocktailData={this.props.getUserCocktailData}
              toggle={this.toggle} />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default CocktailEditModal;