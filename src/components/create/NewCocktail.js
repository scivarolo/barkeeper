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
    recipeIngredients: {},
    recipeName: "",
    recipeInstructions: "",
    ingredientRows: 3
  }

  loadIngredients = () => {
    API.getAll("ingredients")
    .then(ingredients => this.setState({ingredients: ingredients}))
  }

  valueToState = (key, value) => {
    this.setState({[key]: value})
  }

  ingredientToState = (ingredientId, key, value) => {
    //store the values for each ingredient in object together
    //store all ingredient objects in an object together
    this.setState(prevState => {
      let obj = Object.assign({}, prevState.recipeIngredients)

      if(!obj[ingredientId]) obj[ingredientId] = {}
      obj[ingredientId][key] = value

      return {
        recipeIngredients: obj
      }
    })
  }

  addIngredientInput = () => {
    this.setState({
      ingredientRows: this.state.ingredientRows + 1
    })
  }

  outputIngredientInputs = () => {
    let array = []
    for (let i = 1; i <= this.state.ingredientRows; i++) {
      array.push(<IngredientInput
        ingredientToState={this.ingredientToState}
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
            <Input id="recipeName" type="text" bsSize="lg"
              onChange={e => this.valueToState(e.target.id, e.target.value)} />
          </Col>
        </Row>

        {this.outputIngredientInputs()}
        <Button onClick={this.addIngredientInput}>Add Ingredient</Button>
        <Row>
          <Col>
            <Label for="instructions">Instructions</Label>
            <Input type="textarea" id="instructions" onChange={e => this.valueToState(e.target.id, e.target.value)} />
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