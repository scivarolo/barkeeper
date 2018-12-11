/* This is used in NewCocktail for adding ingredients to a recipe.
 */

import React, { Component } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import {
  Col,
  Row,
  InputGroup,
  Input,
  InputGroupAddon
} from 'reactstrap'
import UnitsDropdown from './UnitsDropdown';

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
              allowNew
              newSelectionPrefix="Add New: "
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
                <UnitsDropdown isRequired={this.state.isRequired}
                  onChangeFn={e => this.props.ingredientToState(stateKey, "units", e.target.value)} />
            </InputGroupAddon>
          </InputGroup>
        </Col>
      </Row>
    )
  }

}

export default IngredientInput