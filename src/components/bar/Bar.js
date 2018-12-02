import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'

class Bar extends Component {

  state = {}

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h1>Your Bar</h1>
          </Col>
        </Row>
      </Container>
    )
  }

}

export default Bar