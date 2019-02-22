/**
 * Used throughout when quantities can be updated. Renders the + and - buttons.
 */

import React from "react"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./quantityToggles.scss"

function QuantityToggles(props) {

  return (
    <span className="d-flex quantity-toggles ml-2">
      <span>
        <FontAwesomeIcon onClick={props.increase} icon="plus-circle" />
      </span>
      <span className="ml-1">
        <FontAwesomeIcon onClick={props.decrease} icon="minus-circle" />
      </span>
    </span>
  )

}

export default QuantityToggles

QuantityToggles.propTypes = {
  increase: PropTypes.func.isRequired,
  decrease: PropTypes.func.isRequired
}