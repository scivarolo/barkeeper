
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  Input,
  Label } from "reactstrap"
  import API from '../../modules/data/API'
  import IngredientInput from './IngredientInput'
  import user from '../../modules/data/user'
  import './newCocktail.scss'

// TODO: Prevent already used recipe name

class NewCocktail extends Component {

  state = {
    ingredients: [],
    ingredientInputs: [],
    cocktailIngredients: {},
    cocktailName: "",
    cocktailInstructions: "",
    newCocktailId: "",
    ingredientRows: 3,
    newIngredientIds: []
  }

  componentDidMount() {
    this.loadIngredients().then(() => this.generateInitialInputs())
  }

  loadIngredients = () => {
    return API.getAll("ingredients")
    .then(ingredients => this.setState({ingredients: ingredients}))
  }

  valueToState = (key, value) => {
    this.setState({[key]: value})
  }

  ingredientToState = (ingredientId, key, value) => {
    // store the values for each ingredient in object together
    // and store all ingredient objects in an object together
    this.setState(prevState => {
      let obj = Object.assign({}, prevState.cocktailIngredients)

      if(!obj[ingredientId]) obj[ingredientId] = {}
      obj[ingredientId][key] = value

      return {
        cocktailIngredients: obj
      }
    })
  }

  generateInitialInputs = () => {
    let array = []
    for (let i = 1; i <= this.state.ingredientRows; i++) {
      array.push({
        sortOrder: i,
        key: `ingredient${i}`,
        ingredientId: i
      })
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

    let data = this.state.cocktailIngredients

    // check if either input has data and if sortOrder needs to be updated in state
    this.setState(prevState => {
      let obj = Object.assign({}, prevState.cocktailIngredients)
      if (data[`ingredient${element.ingredientId}`]) {
        obj[`ingredient${element.ingredientId}`].sortOrder = newPosition + 1
      }
      if (data[`ingredient${otherEl.ingredientId}`]) {
        obj[`ingredient${otherEl.ingredientId}`].sortOrder = oldPosition + 1
      }
      return {cocktailIngredients: obj}
    })

    // Reorder inputs
    if (direction === "down") {
      array.splice(oldPosition, 2)
      array.splice(oldPosition, 0, otherEl, element)
    } else {
      array.splice(newPosition, 2)
      array.splice(newPosition, 0, element, otherEl)
    }

    return this.setState({ingredientInputs: array})
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
    // Check if any new ingredients and create entries in ingredients table.
    .then(() => {
      let newIngredients = []
      for (let i in cocktailIngredients) {
        if (cocktailIngredients[i].ingredient.customOption) {
          let obj = {
            label: cocktailIngredients[i].ingredient.label,
            liquid: true,
            createdBy: user.getId()
          }
          if (cocktailIngredients[i].unit === "count") obj.liquid = false
          newIngredients.push(API.saveData("ingredients", obj))
        }
      }
      if (newIngredients.length) {
        return Promise.all(newIngredients)
          .then(newIngredients => {
            // setState with the new ingredient IDs
            this.setState({
              newIngredientIds: newIngredients
            })
        })
      } else {
        return
      }
    })
    // For each ingredient, save relationship in cocktailIngredients
    .then(() => {
      let ingredients = []
      for(let i in cocktailIngredients) {
        if(cocktailIngredients[i].ingredient) {

          //Use the ingredientId unless it was new, then find the id from the newIds array in state
          let ingredientId = cocktailIngredients[i].ingredient.id
          if(cocktailIngredients[i].ingredient.customOption) {
            ingredientId = this.state.newIngredientIds.find(newIng => newIng.label === cocktailIngredients[i].ingredient.label).id
          }

          let ingredientObj = {
            cocktailId: this.state.newRecipeId,
            ingredientId: ingredientId,
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
    // Redirect and show success message
    .then(() => {
      this.props.toggleAlert("success", `${this.state.cocktailname} Created`, `${this.state.cocktailName} saved successfully and added to your list.`)
      this.props.history.push({
        pathname: '/cocktails'
      })
    })
  }

  render() {
    return (
      <Container>
        <Row className="pt-5 mb-5">
          <Col className="d-flex">
            <div>
              <h1>New Cocktail Recipe</h1>
            </div>
          </Col>
        </Row>

        <Form onSubmit={e => this.saveRecipe(e)}>
          <Row>
            <Col>
              <Label for="cocktailName">Recipe Name</Label>
              <Input id="cocktailName" type="text" bsSize="lg"
                onChange={e => this.valueToState(e.target.id, e.target.value)} required={true} />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={7} className="mb-3">
              <Label>Ingredients</Label>
              {
                this.state.ingredientInputs.map((input, index) => {
                  return <IngredientInput
                    ingredientToState={this.ingredientToState}
                    ingredients={this.state.ingredients}
                    moveInputUp={() => this.moveInput("up", index)}
                    moveInputDown={() => this.moveInput("down", index)}
                    sortOrder={input.sortOrder}
                    key={input.key}
                    last={index === this.state.ingredientInputs.length - 1 ? true : false}
                    ingredientId={input.ingredientId} />

                })
              }

              <Button size="sm" onClick={this.addIngredientInput}>Additional Ingredient</Button>
            </Col>

            <Col md={5}>
              <Label for="cocktailInstructions" className="mb-3">Instructions</Label>
              <Input type="textarea" id="cocktailInstructions" onChange={e => this.valueToState(e.target.id, e.target.value)} required={true} rows="5" />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col className="d-flex">
              <Button color="primary" className="ml-auto" type="submit">Save Recipe</Button>
              <Button className="ml-2" tag={Link} to="/cocktails">Cancel</Button>
            </Col>
          </Row>
        </Form>
      </Container>
    )
  }

}

export default NewCocktail