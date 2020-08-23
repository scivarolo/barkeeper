/**
 * Loaded by EditCocktailModal. This is the form to edit the cocktail.
 */
import React, { Component } from "react"
import PropTypes from "prop-types"
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  Input,
  Label } from "reactstrap"
import API from "../../modules/data/data"
import EditIngredientInput from "./EditIngredientInput"
import "./newCocktail.scss"

class EditCocktail extends Component {

  state = {
    ingredients: [],
    cocktailName: "",
    cocktailInstructions: "",
    editedIngredients: {},
    ingredientRows: 3,
    ingredientInputs: []
  }

  componentDidMount() {
    this.setState({ingredientRows: this.props.cocktail.ingredients.length})
    this.loadIngredients().then(() => this.generateInitialInputs())
    this.ingredientsInitialState()
  }

  componentDidUpdate(prevProps) {
    if(prevProps.cocktail !== this.props.cocktail) {
      this.setState({ingredientRows: this.props.cocktail.ingredients.length})
    }
  }

  ingredientsInitialState() {
    //sets state with props when edit modal mounts
    let stateToChange = {
      editedIngredients: {}
    }
    this.props.cocktail.ingredients.forEach((ingredient, i) => {
      stateToChange.editedIngredients[`ingredient${i + 1}`] = {
        ingredientName: ingredient.ingredient.name,
        ingredientId: Number(ingredient.ingredient.id),
        amount: Number(ingredient.amount),
        unit: ingredient.unit,
        sortOrder: Number(ingredient.sort_order)
      }
    })
    this.setState(stateToChange)
  }

  loadIngredients = () => {
    return API.getAll("ingredients")
      .then(ingredients => this.setState({ingredients: ingredients}))
  }

  valueToState = (key, value) => {
    this.setState({[key]: value})
  }

  ingredientToState = (ingredientInputsId, key, value) => {
    //store the values for each ingredient in object together
    //store all ingredient objects in an object together
    this.setState(prevState => {
      let obj = Object.assign({}, prevState.editedIngredients)
      if (!obj[ingredientInputsId]) {
        obj[ingredientInputsId] = {}
      }
      obj[ingredientInputsId][key] = value
      return {
        editedIngredients: obj
      }
    })
  }

  generateInitialInputs = () => {
    let array = []
    for (let i = 1; i <= this.state.ingredientRows; i++) {
      if (i <= this.props.cocktail.ingredients.length) {
        array.push({
          initialIngredientName: this.props.cocktail.ingredients[i-1].ingredient.name,
          initialIngredient: this.props.cocktail.ingredients[i-1],
          sortOrder: i,
          key: `ingredient${i}`,
          ingredientId: i
        })
      }
    }
    return this.setState({ingredientInputs: array})
  }

  addIngredientInput = () => {
    this.setState({
      ingredientRows: this.state.ingredientRows + 1
    })
    this.setState(prevState => {
      let array = prevState.ingredientInputs
      let i = array.length + 1
      array.push({
        sortOrder: i,
        key: `ingredient${i}`,
        ingredientId: i
      })
      return {ingredientInputs: array}
    })
  }

  moveInput = (direction, oldPosition) => {
    let array = this.state.ingredientInputs
    let newPosition = oldPosition - 1
    if (direction === "down") newPosition = oldPosition + 1

    let element = array[oldPosition]
    element.sortOrder = newPosition + 1
    let otherEl = array[newPosition]
    otherEl.sortOrder = oldPosition + 1

    let data = this.state.editedIngredients
    // check if either input has data and if sortOrder needs to be updated in their object in state.
    this.setState(prevState => {
      let obj = Object.assign({}, prevState.editedIngredients)

      if (data[`ingredient${element.ingredientId}`]) {
        obj[`ingredient${element.ingredientId}`].sortOrder = newPosition + 1
      }
      if (data[`ingredient${otherEl.ingredientId}`]) {
        obj[`ingredient${otherEl.ingredientId}`].sortOrder = oldPosition + 1
      }
      return {editedIngredients: obj}
    })

    // Reorder Inputs
    if (direction === "down") {
      array.splice(oldPosition, 2)
      array.splice(oldPosition, 0, otherEl, element)
    } else {
      array.splice(newPosition, 2)
      array.splice(newPosition, 0, element, otherEl)
    }
    return this.setState({ingredientInputs: array})
  }

  editRecipe = e => {
    e.preventDefault()
    //Edit name and instructions
    let patch = {
      name: this.props.cocktail.name,
      instructions: this.props.cocktail.instructions,
      notes: this.props.cocktail.notes,
      ingredients: []
    }
    if (this.state.cocktailName) patch.name = this.state.cocktailName
    if (this.state.cocktailInstructions) patch.instructions = this.state.cocktailInstructions
    if (this.state.cocktailNotes) patch.notes = this.state.cocktailNotes
    if (this.state.cocktailNotes === "") patch.notes = ""

    let {editedIngredients} = this.state
    for (let i in editedIngredients) {
      if (editedIngredients[i].ingredientName.length > 0) {
        let ingredientObj = {
          ingredient: {
            name: editedIngredients[i].ingredientName,
            liquid: editedIngredients[i].unit === "count" ? false : true
          },
          sort_order: editedIngredients[i].sortOrder,
          amount: editedIngredients[i].amount,
          unit: editedIngredients[i].unit
        }
        patch.ingredients.push(ingredientObj)
      }
    }

    return API.edit("cocktails", this.props.cocktail.id, patch)
      .then(() => {
        this.props.getUserCocktailData()
        this.props.toggle()
      })
  }

  render() {
    return (
      <Container>
        <Form onSubmit={e => this.editRecipe(e)}>
          <Row>
            <Col>
              <Label for="cocktailName">Recipe Name</Label>
              <Input id="cocktailName" type="text" bsSize="lg"
                onChange={e => this.valueToState(e.target.id, e.target.value)} required={true} defaultValue={this.props.cocktail.name} />
            </Col>
          </Row>

          {
            this.state.ingredientInputs.map((input, index) => {
              return <EditIngredientInput
                ingredientToState={this.ingredientToState}
                ingredients={this.state.ingredients}
                initialIngredientName={input.initialIngredientName || null}
                initialIngredient={input.initialIngredient || null}
                sortOrder={input.sortOrder}
                moveInputUp={() => this.moveInput("up", index)}
                moveInputDown={() => this.moveInput("down", index)}
                key={input.key}
                ingredientId={input.ingredientId}
                last={index === this.state.ingredientInputs.length - 1 ? true : false} />
            })
          }

          <Button onClick={this.addIngredientInput}>Additional Ingredient</Button>
          <Row>
            <Col className="mt-3">
              <Label for="cocktailInstructions">Instructions</Label>
              <Input type="textarea" rows="4"
                defaultValue={this.props.cocktail.instructions}
                id="cocktailInstructions"
                onChange={e => this.valueToState(e.target.id, e.target.value)}
                required={true} />
              <Label for="cocktailNotes">Notes</Label>
              <Input type="textarea" rows="3"
                defaultValue={this.props.cocktail.notes}
                id="cocktailNotes"
                onChange={e => this.valueToState(e.target.id, e.target.value)} />
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

export default EditCocktail

EditCocktail.displayName = "EditCocktail"
EditCocktail.propTypes = {
  cocktail: PropTypes.object.isRequired,
  getUserCocktailData: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired
}