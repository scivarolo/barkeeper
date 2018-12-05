import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import API from '../../modules/data/API'
class ShoppingList extends Component {

  state = {
    shoppingItems: [],
    isLoaded: false
  }

  componentDidMount() {
    let userId = sessionStorage.getItem("id")
    return API.getWithExpand("shoppingItems", "item", userId)
    .then(items => {
      this.setState({
        shoppingItems: items,
        isLoaded: true
      })
    })
  }

  render() {

    let shoppingItems = this.state.shoppingItems

    if (this.state.isLoaded) {
      return (
        <Container>
          <Row>
            <Col>
              <h1>Shopping List</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <ul>
                {
                  shoppingItems.map(sItem => {
                    return <li key={sItem.id}>{sItem.item.name}</li>
                  })
                }
              </ul>
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

export default ShoppingList