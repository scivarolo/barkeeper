/*
 * This is used in EditCocktail for editing ingredients to a recipe.
 */

import React, { Component } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css'
import {
  Button,
  Col,
  Row,
  InputGroup,
  Input,
  InputGroupAddon
} from 'reactstrap'
import UnitsDropdown from './UnitsDropdown'

class EditIngredientInput extends Component {

  state = {
    isRequired: false,
    disableUnits: false
  }

  componentDidMount() {
    if(!this.props.initialIngredient) {
      this.props.ingredientToState(`ingredient${this.props.ingredientId}`, "additionalIngredient", true)
    }
  }

  checkSelection = (selected) => {
    let newState = {}
    if (selected.length) {
      newState.isRequired = true
      if (selected[0].liquid === false) {
        newState.disableUnits = true
      } else {
        newState.disableUnits = false
      }
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
              defaultSelected={this.props.initialIngredientName ? [this.props.initialIngredientName] : []}
              onChange={selected => {
                if (selected.length) {
                  this.checkSelection(selected)
                  this.props.ingredientToState(stateKey, "ingredientId", selected[0].id)
                  this.props.ingredientToState(stateKey, "ingredientName", selected[0].label)
                  if (selected.length && selected[0].liquid === false) this.props.ingredientToState(stateKey, "unit", "count")
                  selected[0].customOption ? this.setState({isNew: true}) : this.setState({isNew: false})
                }
                else {
                  this.setState({isRequired:false})
                  if(this.props.initialIngredient) {
                    this.props.ingredientToState(stateKey, "ingredientId", this.props.initialIngredient.id)
                  } else {
                    this.props.ingredientToState(stateKey, "ingredientId", "")
                  }
                }
              }} />
              <Input
                type="number"
                placeholder="amount"
                step="any"
                defaultValue={this.props.initialIngredient ? this.props.initialIngredient.amount : ""}
                onChange={e => this.props.ingredientToState(stateKey, "amount", e.target.value)}
                required={this.state.isRequired}></Input>
            <InputGroupAddon addonType="append">
                <UnitsDropdown
                  isDisabled={this.state.disableUnits}
                  isRequired={this.state.isRequired}
                  isNewIngredient={this.state.isNew}
                  initialUnit={this.props.initialIngredient ? this.props.initialIngredient.unit : ""}
                  onChangeFn={e => this.props.ingredientToState(stateKey, "unit", e.target.value)} />
                  {
                    this.props.sortOrder !== 1
                    ? <Button onClick={this.props.moveInputUp}>Up</Button>
                    : null
                  }
                  {
                    !this.props.last
                    ? <Button onClick={this.props.moveInputDown}>Down</Button>
                    : null
                  }
            </InputGroupAddon>
          </InputGroup>
        </Col>
      </Row>
    )
  }

}

export default EditIngredientInput