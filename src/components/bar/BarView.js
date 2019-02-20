/**
 * Main Bar Inventory View component
 */

import React, { useEffect, useState } from "react"
import {
  Button,
  Container,
  Row,
  Col,
  InputGroup,
  ListGroup,
  Spinner } from "reactstrap"
import API from "../../modules/data/data"
import BarItem from "./BarItem"
import AddToBar from "./AddToBar"

function BarView(props) {

  const [inventory, setInventory] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [showAddInput, setShowAddInput] = useState(false)

  const getInventory = () => {
    return API.getAll("user_products")
      .then(inventory => setInventory(inventory))
  }

  const toggleAdd = () => {
    setShowAddInput(!showAddInput)
  }

  useEffect(() => {
    getInventory()
      .then(() => setIsLoaded(true))
  }, [])

  if (isLoaded) {
    return (
      <Container>
        <Row className="my-5">
          <Col className="d-flex" md={4}>
            <h1>Your Bar</h1>
          </Col>
          <Col md={8}>
            <InputGroup className="d-flex">
              <AddToBar
                show={showAddInput}
                toggle={toggleAdd}
                inventory={inventory}
                getInventory={getInventory}
                toggleAlert={props.toggleAlert} />

              <Button onClick={toggleAdd} color="warning" className="ml-auto">
                {
                  showAddInput ? "Cancel" : "Add Products"
                }
              </Button>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <ListGroup>
              { /* List items in inventory */
                inventory.length ?
                  inventory.map(item => {
                    return (
                      <BarItem
                        key={item.id}
                        item={item}
                        getInventory={getInventory} />
                    )
                  })
                  : (<h4>You don't have any products in your bar. Add some!</h4>)
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
        <div className="mt-5 text-center"><Spinner color="success" style={{width: "3rem", height: "3rem"}} /></div>
      </Container>
    )
  }

}

export default BarView