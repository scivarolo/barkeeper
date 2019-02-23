/**
 * Used throughout the app to select units.
 **/

import React from "react"
import PropTypes from "prop-types"
import { Input } from "reactstrap"

export default function UnitsDropdown(props) {

  return (
    <Input disabled={props.isDisabled} id="unitsDropdown" type="select" required={props.isRequired} defaultValue={props.initialUnit} value={props.isDisabled ? "count" : undefined}
      onChange={props.onChangeFn}>
      {
        props.isDisabled
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
        props.isNewIngredient ? <option>count</option> : null
      }

    </Input>
  )

}

UnitsDropdown.displayName = "UnitsDropdown"
UnitsDropdown.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  initialUnit: PropTypes.string,
  onChangeFn: PropTypes.func.isRequired,
  isNewIngredient: PropTypes.bool
}