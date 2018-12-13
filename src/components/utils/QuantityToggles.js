import React, { Component } from 'react';

class QuantityToggles extends Component {

  render() {
    return (
      <span className="ml-2">
        <i onClick={this.props.decrease} className="icon-minus icons mx-1"></i>
        <i onClick={this.props.increase} className="icon-plus icons mx-1"></i>
      </span>
    )
  }

}

export default QuantityToggles