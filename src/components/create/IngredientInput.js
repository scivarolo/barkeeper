import React, { Component } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import {
  Col,
  Row,
  InputGroup,
  Input,
  InputGroupAddon
} from 'reactstrap'

//TODO: Pull in units list from database

class IngredientInput extends Component {

  state = {
    isRequired: false
  }

  render() {

    let { ingredientId, ingredients } = this.props
    let stateKey = `ingredient${ingredientId}`

    return (
      <Row id={ingredientId} className="my-2">
        <Col>
          <InputGroup>
            <Typeahead
              id="recipeName"
              labelKey="label"
              options={ingredients}
              placeholder="Search for Ingredient"
              onChange={selected => {
                if (selected.length) {
                  this.setState({isRequired: true})
                }
                else {
                  this.setState({isRequired:false})
                }
                this.props.ingredientToState(stateKey, "ingredient", selected[0])
                this.props.ingredientToState(stateKey, "sortOrder", ingredientId)
                }} />
              <Input type="number" placeholder="amount"
                onChange={e => this.props.ingredientToState(stateKey, "amount", e.target.value)}required={this.state.isRequired}></Input>
            <InputGroupAddon addonType="append">
              <Input type="select" required={this.state.isRequired}
                onChange={e => this.props.ingredientToState(stateKey, "unit", e.target.value)}>
                <option value="">unit</option>
                <option>oz</option>
                <option>ml</option>
                <option>dashes</option>
                <option>tbsp</option>
                <option>barspoon</option>
              </Input>
            </InputGroupAddon>
          </InputGroup>
        </Col>
      </Row>
    )
  }

}

export default IngredientInput