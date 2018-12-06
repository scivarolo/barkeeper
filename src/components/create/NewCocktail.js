import React, { Component } from 'react'
import {
  Button,
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  Input,
  Label } from "reactstrap";
import { Typeahead } from 'react-bootstrap-typeahead'
import API from '../../modules/data/API';
import IngredientInput from './IngredientInput'

class NewCocktail extends Component {

  state = {
    ingredients: [],
    ingredientRows: 4
  }

  loadIngredients = () => {
    API.getAll("ingredients")
    .then(ingredients => this.setState({ingredients: ingredients}))
  }

  updateValuesInState = (key, value) => {
    this.setState({[key]: value})
  }

  outputIngredientInputs = () => {
    let array = []
    for (let i = 1; i <= this.state.ingredientRows; i++) {
      array.push(<IngredientInput
        updateValues={this.updateValuesInState}
        ingredients={this.state.ingredients}
        key={`ingredient${i}`}
        ingredientId={`ingredient${i}`} />)
    }
    return array
  }

  componentDidMount() {
    this.loadIngredients()
  }

  render() {
    return (
      <Container>

        <h1>New Cocktail Recipe</h1>
        <Row>
          <Col>
            <Label for="recipeName">Recipe Name</Label>
            <Input id="recipeName" type="text" bsSize="lg" />
          </Col>
        </Row>

        {this.outputIngredientInputs()}
        <Button onClick={() => this.setState({ingredientRows: this.state.ingredientRows + 1})}>Add Ingredient</Button>
        <Row>
          <Col>
            <Label for="instructions">Instructions</Label>
            <Input type="textarea" id="instructions" />
          </Col>
        </Row>

        <Row className="mt-3">
          <Col>
            <Button>Save Recipe</Button>
          </Col>
        </Row>
      </Container>
    )
  }

}

export default NewCocktail