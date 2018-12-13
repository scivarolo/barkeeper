import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './quantityToggles.scss'

class QuantityToggles extends Component {

  render() {
    return (
      <span className="d-flex quantity-toggles ml-2">
        <span>
          <FontAwesomeIcon onClick={this.props.increase} icon="plus-circle" />
        </span>
        <span className="ml-1">
          <FontAwesomeIcon onClick={this.props.decrease} icon="minus-circle" />
        </span>
      </span>
    )
  }

}

export default QuantityToggles