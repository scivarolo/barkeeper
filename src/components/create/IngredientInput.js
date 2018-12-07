import React, { Component } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import {
  Col,
  Row,
  InputGroup,
  Input,
  InputGroupAddon
} from 'reactstrap'

class IngredientInput extends Component {


  render() {
    return (
      <Row id={this.props.ingredientId} className="my-2">
        <Col>
          <InputGroup>
            <Typeahead
              labelKey="label"
              options={this.props.ingredients}
              placeholder="Search for Ingredient"
              onChange={selected => this.props.ingredientToState(this.props.ingredientId, "label", selected[0].id)} />
              <Input type="number" placeholder="amount"
                onChange={e => this.props.ingredientToState(this.props.ingredientId, "amount", e.target.value)}></Input>
            <InputGroupAddon addonType="append">
              <Input type="select"
                onChange={e => this.props.ingredientToState(this.props.ingredientId, "unit", e.target.value)}>
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