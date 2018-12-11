import React, { Component } from 'react'
import { Input } from 'reactstrap'
class UnitsDropdown extends Component {

// props: isRequired (state), onChange

  render() {
    return (
      <Input id="unitsDropdown" type="select" required={this.props.isRequired} defaultValue={this.props.initialUnit}
        onChange={this.props.onChangeFn}>
        <option value="">unit</option>
        <option>oz</option>
        <option>ml</option>
        <option>dashes</option>
        <option>tbsp</option>
        <option>barspoon</option>
      </Input>
    )
  }

}

export default UnitsDropdown