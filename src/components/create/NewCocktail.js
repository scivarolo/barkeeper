
import React, { Component } from 'react'
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  Input,
  Label } from "reactstrap";
  import API from '../../modules/data/API';
  import IngredientInput from './IngredientInput'
  import user from '../../modules/data/user';

// TODO: Affordance to add a new ingredient on the fly.
// TODO: Prevent already used recipe name?
// TODO: Make an ingredient "optional" (won't count against ability to make it)

class NewCocktail extends Component {

  state = {
    ingredients: [],
    cocktailIngredients: {},
    cocktailName: "",
    cocktailInstructions: "",
    newCocktailId: "",
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
      let obj = Object.assign({}, prevState.cocktailIngredients)

      if(!obj[ingredientId]) obj[ingredientId] = {}
      obj[ingredientId][key] = value

      return {
        cocktailIngredients: obj
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
        ingredientId={i} />)
    }
    return array
  }

  saveRecipe = (e) => {
    e.preventDefault()

    let {cocktailIngredients, cocktailName, cocktailInstructions} = this.state
    // Save Recipe Name and Instructions to "cocktails" resource
    API.saveData("cocktails", {
      name: cocktailName,
      instructions: cocktailInstructions,
      createdBy: user.getId()
    })
    // Capture new recipe ID from response
    .then(r => this.setState({newRecipeId: r.id}))
    // For each ingredient, save relationship in cocktailIngredients
    // Includes cocktailId, ingredientId, amount, unit, sortOrder, isRequired:true
    .then(() => {
      let ingredients = []
      for(let i in cocktailIngredients) {
        if(cocktailIngredients[i].ingredient) {
          let ingredientObj = {
            cocktailId: this.state.newRecipeId,
            ingredientId: cocktailIngredients[i].ingredient.id,
            sortOrder: cocktailIngredients[i].sortOrder,
            amount: Number(cocktailIngredients[i].amount),
            unit: cocktailIngredients[i].unit,
            isRequired: true
          }
          ingredients.push(API.saveData("cocktailIngredients", ingredientObj))
        }
      }
      return Promise.all(ingredients)
    })
    // Save relationship to userCocktails with new recipe ID
    .then(() => API.saveData("userCocktails", {
      cocktailId: this.state.newRecipeId,
      userId: user.getId(),
      wantToMake: true,
      makeCount: 0
    }))
    .then(() => this.props.history.push('/cocktails'))
  }

  componentDidMount() {
    this.loadIngredients()
  }

  render() {
    return (
      <Container>

        <h1>New Cocktail Recipe</h1>
        <Form onSubmit={e => this.saveRecipe(e)}>
          <Row>
            <Col>
              <Label for="cocktailName">Recipe Name</Label>
              <Input id="cocktailName" type="text" bsSize="lg"
                onChange={e => this.valueToState(e.target.id, e.target.value)} required={true} />
            </Col>
          </Row>

          {this.outputIngredientInputs()}
          <Button onClick={this.addIngredientInput}>Add Ingredient</Button>
          <Row>
            <Col>
              <Label for="cocktailInstructions">Instructions</Label>
              <Input type="textarea" id="cocktailInstructions" onChange={e => this.valueToState(e.target.id, e.target.value)} required={true} />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              <Button type="submit">Save Recipe</Button>
            </Col>
          </Row>
        </Form>
      </Container>
    )
  }

}

export default NewCocktail