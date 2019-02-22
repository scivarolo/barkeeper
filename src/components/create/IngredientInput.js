/**
 * This is used in NewCocktail for adding ingredients to a recipe.
 */

import React, { Component } from "react"
import PropTypes from "prop-types"
import { Typeahead } from "react-bootstrap-typeahead"
import "react-bootstrap-typeahead/css/Typeahead.css"
import "react-bootstrap-typeahead/css/Typeahead-bs4.css"
import {
  Col,
  Row,
  InputGroup,
  Input,
  InputGroupAddon
} from "reactstrap"
import UnitsDropdown from "./UnitsDropdown"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

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

    let { ingredientId, ingredients, sortOrder } = this.props
    let stateKey = `ingredient${ingredientId}`

    return (
      <Row id={ingredientId} className="my-2">
        <Col>
          <InputGroup>
            <Typeahead
              className="ingredient-typeahead"
              allowNew
              newSelectionPrefix="Add New: "
              labelKey="name"
              options={ingredients}
              placeholder="Search for Ingredient"
              onChange={selected => {
                this.checkSelection(selected)
                this.props.ingredientToState(stateKey, "ingredient", selected[0])
                this.props.ingredientToState(stateKey, "sortOrder", sortOrder)
                if (selected.length && selected[0].liquid === false) this.props.ingredientToState(stateKey, "unit", "count")
                selected.length && selected[0].customOption
                  ? this.setState({isNew: true})
                  : this.setState({isNew: false})
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
              <span className="move-ingredients ml-2 d-flex align-items-center flex-column">
                {
                  sortOrder !== 1
                    ? <div className="ingredient-up">
                      <FontAwesomeIcon icon="chevron-up" onClick={this.props.moveInputUp} />
                    </div>
                    : null
                }
                {
                  !this.props.last
                    ? <div className="ingredient-down">
                      <FontAwesomeIcon icon="chevron-down" onClick={this.props.moveInputDown} />
                    </div>
                    : null
                }
              </span>
            </InputGroupAddon>
          </InputGroup>
        </Col>
      </Row>
    )
  }

}

export default IngredientInput

IngredientInput.propTypes = {
  ingredientId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  sortOrder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  ingredients: PropTypes.array.isRequired,
  ingredientToState: PropTypes.func.isRequired,
  moveInputUp: PropTypes.func.isRequired,
  moveInputDown: PropTypes.func.isRequired,
  last: PropTypes.bool.isRequired
}