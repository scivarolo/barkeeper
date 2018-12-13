import React, { Component } from 'react'
import QuantityToggles from '../utils/QuantityToggles';
import API from '../../modules/data/API';

class BarTabCocktail extends Component {

  state = {}

  increaseQuantity = () => {
    return API.editData("userTab", this.props.cocktail.id, {
      quantity: this.props.cocktail.quantity + 1
    }).then(() => this.props.getUserTab())
  }

  decreaseQuantity = () => {
    if (this.props.cocktail.quantity === 1) {
      return this.props.removeFromUserTab(this.props.cocktail.id)
    } else {
      return API.editData("userTab", this.props.cocktail.id, {
        quantity: this.props.cocktail.quantity - 1
      }).then(() => this.props.getUserTab())
    }
  }

  render() {
    return (
      <tr>
        <td>{this.props.cocktail.cocktail.name}</td>
        <td>
          <div className="d-flex">
          {this.props.cocktail.quantity}
          <QuantityToggles
            increase={this.increaseQuantity}
            decrease={this.decreaseQuantity} />
            </div>
        </td>
      </tr>
    )
  }

}

export default BarTabCocktail