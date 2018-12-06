import React, { Component } from 'react'
import {
  Container,
  Row,
  Col,
  ListGroup } from 'reactstrap'
import API from '../../modules/data/API';
import BarItem from './BarItem'
import BarAddModal from './BarAddModal'
class Bar extends Component {

  state = {
    isLoaded: false,
    inventory: []
  }

  getInventoryData = () => {
    let userId = sessionStorage.getItem("id")
    return API.getWithExpand("userProducts", "product", userId)
    .then(inventory => this.setState({
      inventory: inventory
    }))
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
                <BarAddModal
                  buttonLabel="Add to Inventory"
                  getInventoryData={this.getInventoryData} />
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

export default Bar