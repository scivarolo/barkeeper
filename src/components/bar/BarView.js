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
  ListGroup } from "reactstrap"
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
              <AddToBar show={showAddInput}
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
                inventory.map(item => {
                  return (
                    <BarItem
                      key={item.id}
                      item={item}
                      getInventory={getInventory} />
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

export default BarView