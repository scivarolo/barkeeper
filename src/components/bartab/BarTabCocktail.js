import React, { Component } from 'react'
import { Input } from 'reactstrap'
import QuantityToggles from '../utils/QuantityToggles'
import jsonAPI from '../../modules/data/API'

class BarTabCocktail extends Component {

  state = {}

  increaseQuantity = () => {
    return jsonAPI.editData("userTab", this.props.cocktail.id, {
      quantity: this.props.cocktail.quantity + 1
    }).then(() => this.props.getUserTab())
  }

  decreaseQuantity = () => {
    if (this.props.cocktail.quantity === 1) {
      return this.props.removeFromUserTab(this.props.cocktail.id)
    } else {
      return jsonAPI.editData("userTab", this.props.cocktail.id, {
        quantity: this.props.cocktail.quantity - 1
      }).then(() => this.props.getUserTab())
    }
  }

  renderIngredientOptions = () => {
    /**
     * if an ingredient has multiple options,
     * return an input with the options
     **/
    let cocktailProducts = this.props.cocktailProducts
    for(let i in cocktailProducts) {
      if(cocktailProducts[i].length > 1) {
        return (
          <div>
            Choose: <Input onChange={(e) => this.props.makeWithThisIngredient(e, this.props.cocktail.id, Number(i))} bsSize="sm" type="select" style={{width:"125px", display: "inline"}}>
              {
                cocktailProducts[i].map(product => {
                  return <option value={product.productId} key={product.productId}>{product.product.name}</option>
                })
              }
            </Input>
          </div>
        )
      } else {
        return null
      }
    }
  }

  render() {
    return (
      <tr>
        <td>
          <div>{this.props.cocktail.cocktail.name}</div>
          {this.renderIngredientOptions()}
        </td>

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