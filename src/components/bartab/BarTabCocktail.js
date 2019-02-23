import React, { Component } from "react"
import PropTypes from "prop-types"
import { Input } from "reactstrap"
import QuantityToggles from "../utils/QuantityToggles"
import API from "../../modules/data/data"

class BarTabCocktail extends Component {

  state = {
    optionsArray: []
  }

  componentDidMount() {
    this.renderIngredientOptions()
  }

  componentDidUpdate(prevProps) {
    if(prevProps.cocktailProducts !== this.props.cocktailProducts) {
      this.renderIngredientOptions()
    }
  }

  increaseQuantity = () => {
    return API.edit("user_tab", this.props.cocktail.id, {
      quantity: this.props.cocktail.quantity + 1
    }).then(() => this.props.getUserTab())
  }

  decreaseQuantity = () => {
    if (this.props.cocktail.quantity === 1) {
      return this.props.removeFromUserTab(this.props.cocktail.id)
    } else {
      return API.edit("user_tab", this.props.cocktail.id, {
        quantity: this.props.cocktail.quantity - 1
      }).then(() => this.props.getUserTab())
    }
  }

  renderIngredientOptions = () => {
    /**
     * if an ingredient has multiple options,
     * return an input with the options
     * TODO: THis is only returning one because it needs to map over the object to display multiples if needed
     **/
    let cocktailProducts = this.props.cocktailProducts
    let optionsArray = []
    for(let i in cocktailProducts) {
      if(cocktailProducts[i].length > 1) {
        optionsArray.push( (
          <div key={i}>
            Choose: <Input onChange={(e) => this.props.makeWithThisIngredient(e, this.props.cocktail.id, Number(i))} bsSize="sm" type="select" style={{width:"125px", display: "inline"}}>
              {
                cocktailProducts[i].map(product => {
                  return <option value={product.product.id} key={product.product.id}>{product.product.name}</option>
                })
              }
            </Input>
          </div>
        ))
      }
    }
    return this.setState({optionsArray: optionsArray})
  }

  render() {
    return (
      <tr>
        <td>
          <div>{this.props.cocktail.cocktail.name}</div>
          {this.state.optionsArray.map(option => option)}
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

BarTabCocktail.dispayName = "BarTabCocktail"
BarTabCocktail.propTypes = {
  cocktailProducts: PropTypes.object.isRequired,
  cocktail: PropTypes.object.isRequired,
  getUserTab: PropTypes.func.isRequired,
  removeFromUserTab: PropTypes.func.isRequired,
  makeWithThisIngredient: PropTypes.func.isRequired
}