/**
 * Used throughout the app to select units.
 **/

import React, { Component } from 'react'
import { Input } from 'reactstrap'
class UnitsDropdown extends Component {

  render() {
    return (
      <Input disabled={this.props.isDisabled} id="unitsDropdown" type="select" required={this.props.isRequired} defaultValue={this.props.initialUnit} value={this.props.isDisabled ? "count" : undefined}
        onChange={this.props.onChangeFn}>
        {
          this.props.isDisabled
          ? <>
              <option value="count">count</option>
            </>
          : null
        }
        <option value="">unit</option>
        <option>oz</option>
        <option>ml</option>
        <option>dashes</option>
        <option>tbsp</option>
        <option>barspoon</option>
        {
          this.props.isNewIngredient ? <option>count</option> : null
        }

      </Input>
    )
  }

}

export default UnitsDropdown