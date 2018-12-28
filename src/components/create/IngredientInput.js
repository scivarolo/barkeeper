/* This is used in NewCocktail for adding ingredients to a recipe.
 */

import React, { Component } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css'
import {
  Col,
  Row,
  InputGroup,
  Input,
  InputGroupAddon
} from 'reactstrap'
import UnitsDropdown from './UnitsDropdown'

class IngredientInput extends Component {

  state = {
    isRequired: false,
    disableUnits: false
  }

  checkSelection = (selected) => {
    let newState = {}
    if (selected.length) {
      newState.isRequired = true
      if (selected[0].liquid === false) newState.disableUnits = true
    } else {
      newState.isRequired = false
    }
    this.setState(newState)
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
                this.checkSelection(selected)
                this.props.ingredientToState(stateKey, "ingredient", selected[0])
                this.props.ingredientToState(stateKey, "sortOrder", ingredientId)
                if (selected.length && selected[0].liquid === false) this.props.ingredientToState(stateKey, "unit", "count")
                selected[0].customOption ? this.setState({isNew: true}) : this.setState({isNew: false})
                }} />
              <Input
                type="number"
                placeholder="amount"
                step="any"
                onChange={e => this.props.ingredientToState(stateKey, "amount", e.target.value)}
                required={this.state.isRequired}></Input>
            <InputGroupAddon addonType="append">
                <UnitsDropdown
                  isDisabled={this.state.disableUnits}
                  isRequired={this.state.isRequired}
                  isNewIngredient={this.state.isNew}
                  onChangeFn={e => this.props.ingredientToState(stateKey, "unit", e.target.value)} />
            </InputGroupAddon>
          </InputGroup>
        </Col>
      </Row>
    )
  }

}

export default IngredientInput