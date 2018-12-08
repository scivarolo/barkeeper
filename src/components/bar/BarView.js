import React, { Component } from 'react'
import {
  Button,
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  ListGroup } from 'reactstrap'
import API from '../../modules/data/API';
import BarItem from './BarItem'
import AddToBar from './AddToBar';
import { Alert, AlertContainer } from 'react-bs-notifier'

class BarView extends Component {

  state = {
    inventory: [],
    isLoaded: false,
    showAddInput: false,
    showSuccessMessage: false,
    successMessage: ""
  }

  getInventoryData = () => {
    let userId = sessionStorage.getItem("id")
    return API.getWithExpand("userProducts", "product", userId)
    .then(inventory => this.setState({
      inventory: inventory
    }))
  }

  toggleAdd = () => {
    this.setState({showAddInput: !this.state.showAddInput})
  }

  toggleSuccessMessage = (message) => {
    this.setState({showSuccessMessage: true, successMessage: message})
    setTimeout(function(){
      this.setState({showSuccessMessage: false, successMessage: ""});
    }.bind(this), 3000)
  }

  componentDidMount() {
    this.getInventoryData()
    .then(() => this.setState({isLoaded: true}))
  }


  render() {
    let inventory = this.state.inventory

    if(this.state.isLoaded) {
      return (
        <Container>
          <Row className="my-5">
            <Col className="d-flex">
              <div>
                <h1>Your Bar</h1>
              </div>
              <div className="ml-auto">
                <InputGroup>
                  <AddToBar show={this.state.showAddInput}
                    toggle={this.toggleAdd}
                    toggleSuccessMessage={this.toggleSuccessMessage}
                    getInventoryData={this.getInventoryData} />
                  <InputGroupAddon addonType="append">
                    <Button onClick={this.toggleAdd}>
                    {
                      this.state.showAddInput ? "Nevermind" : "Add Products"
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
                { /* List items in inventory */
                  inventory.map(item => {
                    return (
                      <BarItem
                        key={item.id}
                        item={item}
                        getInventoryData={this.getInventoryData} />
                    )
                  })
                }
              </ListGroup>
            </Col>
          </Row>
          <AlertContainer>
            {this.state.showSuccessMessage
              ? ( <Alert type="success" headline="Successfully Added">
                    {this.state.successMessage}
                  </Alert> ) : null }
          </AlertContainer>
        </Container>
      )
    }
    else {
      return (
        <Container>
          <div>Loading</div>
        </Container>
      )
    }
  }

}

export default BarView