/*
 * This is used in EditCocktail for editing ingredients to a recipe.
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

class EditIngredientInput extends Component {

  state = {
    isRequired: false
  }

  componentDidMount() {
    if(!this.props.initialIngredient) {
      this.props.ingredientToState(`ingredient${this.props.ingredientId}`, "additionalIngredient", true)
    }
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
                  this.setState({isRequired: true})
                  this.props.ingredientToState(stateKey, "ingredientId", selected[0].id)
                  this.props.ingredientToState(stateKey, "ingredientName", selected[0].label)
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
                step="any"
                placeholder="amount"
                defaultValue={this.props.initialIngredient ? this.props.initialIngredient.amount : ""}
                onChange={e => this.props.ingredientToState(stateKey, "amount", e.target.value)}
                required={this.state.isRequired}></Input>
            <InputGroupAddon addonType="append">
                <UnitsDropdown isRequired={this.state.isRequired}
                  initialUnit={this.props.initialIngredient ? this.props.initialIngredient.unit : ""}
                  onChangeFn={e => this.props.ingredientToState(stateKey, "unit", e.target.value)} />
            </InputGroupAddon>
          </InputGroup>
        </Col>
      </Row>
    )
  }

}

export default EditIngredientInput