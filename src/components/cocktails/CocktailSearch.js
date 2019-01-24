/**
 * Allows a user to search for a cocktail in their list,
 * or in the global list by name (depending on which view they are in).
 */

import React, { Component } from 'react'
import { Input } from 'reactstrap'

class CocktailSearch extends Component {

  state = {
    searchQuery: ""
  }

  handleFieldChange(e) {
    this.setState({[e.target.id]: e.target.value})
    this.props.search(this.props.searchData, this.props.searchIngredients, e.target.value)
  }

  clear = () => {
    this.setState({searchQuery: ""})
  }

  render() {
    return (
      <div>
        <Input type="text" id="searchQuery" placeholder={this.props.placeholder} value={this.state.searchQuery} onChange={e => this.handleFieldChange(e)}></Input>
      </div>
    )
  }

}

export default CocktailSearch