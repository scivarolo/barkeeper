import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './quantityToggles.scss'

class QuantityToggles extends Component {

  render() {
    return (
      <span className="quantity-toggles ml-2">
        <FontAwesomeIcon onClick={this.props.increase} icon="plus-circle" />{' '}
        <FontAwesomeIcon onClick={this.props.decrease} icon="minus-circle" />
      </span>
    )
  }

}

export default QuantityToggles