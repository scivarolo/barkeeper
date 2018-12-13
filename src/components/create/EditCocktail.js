
import React, { Component } from 'react'
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  Input,
  Label } from "reactstrap"
  import API from '../../modules/data/API'
  import EditIngredientInput from './EditIngredientInput'
  import user from '../../modules/data/user'

class EditCocktail extends Component {

  state = {
    ingredients: [],
    cocktailName: "",
    cocktailInstructions: "",
    ingredientRows: 3
  }

  componentDidMount() {
    this.loadIngredients()
    this.setState({ingredientRows: this.props.cocktail.cocktailIngredients.length})
    this.ingredientsInitialState()

  }

  componentDidUpdate(prevProps) {
    if(prevProps.cocktail !== this.props.cocktail) {
      this.setState({ingredientRows: this.props.cocktail.cocktailIngredients.length})
    }
  }

  ingredientsInitialState() {
    //sets state with props when edit modal mounts
    let stateToChange = {
      editedIngredients: {}
    }
    this.props.cocktail.cocktailIngredients.forEach((ingredient, i) => {
      stateToChange.editedIngredients[`ingredient${i + 1}`] = {
        ingredientId: Number(ingredient.ingredientId),
        cocktailId: Number(ingredient.cocktailId),
        amount: Number(ingredient.amount),
        unit: ingredient.unit,
        sortOrder: Number(ingredient.sortOrder),
        isRequired: true,
        id: Number(ingredient.id)
      }
    })
    this.setState(stateToChange)
  }

  loadIngredients = () => {
    API.getAll("ingredients")
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
      if(!obj[ingredientInputsId]) obj[ingredientInputsId] = {}
      obj[ingredientInputsId][key] = value
      return {
        editedIngredients: obj
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
      if(i <= this.props.cocktail.cocktailIngredients.length) {
        array.push(
          <EditIngredientInput
            ingredientToState={this.ingredientToState}
            ingredients={this.state.ingredients}
            initialIngredientName={this.props.ingredientNames.find(label => label.id === this.props.cocktail.cocktailIngredients[i-1].ingredientId)}
            initialIngredient={this.props.cocktail.cocktailIngredients[i-1]}
            key={`ingredient${i}`}
            ingredientId={i} />
        )
      } else {
        array.push(
          <EditIngredientInput
          ingredientToState={this.ingredientToState}
          ingredients={this.state.ingredients}
          key={`ingredient${i}`}
          ingredientId={i} />
        )
      }
    }
    return array
  }

  editRecipe = (e) => {
    e.preventDefault()
    //Edit name and instructions
    let patch = {
      name: this.props.cocktail.name,
      instructions: this.props.cocktail.instructions
    }
    if(this.state.cocktailName) patch.name = this.state.cocktailName
    if(this.state.cocktailInstructions) patch.instructions = this.state.cocktailInstructions
    return API.editData("cocktails", this.props.cocktail.id, patch)

    //End edit name and instructions
      .then(() => {
        let ingredientUpdates = []
        let {editedIngredients} = this.state
        for(let i in editedIngredients) {
          if(editedIngredients[i].additionalIngredient) {
            //this is an additional ingredient from the original.
            if(Number(editedIngredients[i].ingredientId)) {
              ingredientUpdates.push(API.saveData("cocktailIngredients", {
                ingredientId: editedIngredients[i].ingredientId,
                cocktailId: this.props.cocktail.id,
                amount: editedIngredients[i].amount,
                unit: editedIngredients[i].unit,
                sortOrder: editedIngredients[i].sortOrder,
                isRequired: true
              }))
            } else if (editedIngredients[i].ingredientId !== "") {
              //we're making a new one!
              //need ingredient name here.
              let newIngredientObj = {
                label: editedIngredients[i].ingredientName,
                createdBy: user.getId()
              }
              ingredientUpdates.push(
                API.saveData("ingredients", newIngredientObj)
                .then(r => API.saveData("cocktailIngredients", {
                    ingredientId: r.id,
                    cocktailId: this.props.cocktail.id,
                    amount: editedIngredients[i].amount,
                    unit: editedIngredients[i].unit,
                    sortOrder: editedIngredients[i].sortOrder,
                    isRequired: true
                  })
                )
              )
            }
          } else {
            //we're editing an exisiting cocktailIngredient!
            if (Number(editedIngredients[i].ingredientId)) {
              let editObj = {
                ingredientId: editedIngredients[i].ingredientId,
                cocktailId: this.props.cocktail.id,
                amount: editedIngredients[i].amount,
                unit: editedIngredients[i].unit,
                sortOrder: editedIngredients[i].sortOrder,
                isRequired: true
              }
              ingredientUpdates.push(API.editData("cocktailIngredients", editedIngredients[i].id, editObj ))
            } else if (editedIngredients[i].ingredientId !== "") {
              // we need to create an ingredient first!
              let newIngredientObj = {
                label: editedIngredients[i].ingredientName,
                createdBy: user.getId()
              }
              ingredientUpdates.push(
                API.saveData("ingredients", newIngredientObj)
                .then(r => API.editData("cocktailIngredients", editedIngredients[i].id, {
                    ingredientId: r.id,
                    cocktailId: this.props.cocktail.id,
                    amount: editedIngredients[i].amount,
                    unit: editedIngredients[i].unit,
                    sortOrder: editedIngredients[i].sortOrder,
                    isRequired: true
                  })
                )
              )
            }
          }
        }
        return Promise.all(ingredientUpdates)
      })
      .then(() => {
        this.props.getCocktailData()
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

          {this.outputIngredientInputs()}

          <Button onClick={this.addIngredientInput}>Additional Ingredient</Button>
          <Row>
            <Col>
              <Label for="cocktailInstructions">Instructions</Label>
              <Input type="textarea"
                defaultValue={this.props.cocktail.instructions}
                id="cocktailInstructions"
                onChange={e => this.valueToState(e.target.id, e.target.value)}
                required={true} />
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