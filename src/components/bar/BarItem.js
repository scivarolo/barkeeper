/**
 * Component for a single item in the user's Bar Inventory
 */

import React, { useState } from "react"
import PropTypes from "prop-types"
import {
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Progress,
  ListGroupItem } from "reactstrap"
import QuantityToggles from "../utils/QuantityToggles"
import "./barItem.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import API from "../../modules/data/data"

function BarItem(props) {

  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [updateValue, setUpdateValue] = useState("")

  // Toggle the update form for updating the volume of a liquor
  const toggleUpdateForm = () => setShowUpdateForm(!showUpdateForm)

  const handleFieldChange = (e) => {
    let val = e.target.value
    if (e.target.value > props.item.product.size) {
      val = props.item.product.size
    }
    setUpdateValue(val)
  }

  // Update the volume of a product
  const updateItemAmount = () => {
    if (updateValue) {
      let obj = {...props.item}
      obj.amount_available = updateValue
      obj.product_id = props.item.product.id
      delete obj.product

      return API.edit("user_products", props.item.id, obj)
        .then(() => {
          toggleUpdateForm()
          props.getInventory()
        })
    }
  }

  const deleteItem = (id) => {
    return API.delete("user_products", id)
      .then(() => props.getInventory())
  }

  const increaseQuantity = () => {
    return API.edit("user_products", props.item.id, {
      quantity: props.item.quantity + 1
    }).then(() => props.getInventory())
  }

  const decreaseQuantity = () => {
    if (props.item.quantity === 1) {
      return deleteItem(props.item.id)
    } else {
      return API.edit("user_products", props.item.id, {
        quantity: props.item.quantity - 1
      }).then(() => props.getInventory())
    }
  }

  let item = props.item
  return (
    <ListGroupItem className="mb-2 bar-item" id={item.id}>
      <h4>{item.product.name} ({item.product.size} {item.product.unit})</h4>
      <div className="d-flex">
        { item.product.unit !== "count"
          ? <>
              <div style={{width: "150px"}}>
                <Progress
                  className="item-amount-chart"
                  color={
                    (item.amount_available / item.product.size <= 0.25) && item.quantity === 1
                      ? "danger"
                      : "primary"}
                  value={item.amount_available}
                  max={item.product.size} />
              </div>
              <div className="mx-3">
                <span>{item.amount_available} {item.product.unit}</span>
                { showUpdateForm
                  ? <div className="updateItem mx-2">
                    <InputGroup size="sm">
                      <Input size="sm" type="number" min="0" step="any" max={item.product.size} value={updateValue} style={{border: "1px solid lightgray", maxWidth:"70px"}}
                        placeholder={item.amount_available} onChange={e => handleFieldChange(e)} />
                      <InputGroupAddon addonType="append">
                        <InputGroupText>{item.product.unit}</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupAddon addonType="append">
                        <Button onClick={updateItemAmount} color="warning">
                          <FontAwesomeIcon icon="check" />
                        </Button>
                        <Button onClick={toggleUpdateForm} color="danger">
                          <FontAwesomeIcon icon="times" />
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                  : <FontAwesomeIcon icon="pen" className="mx-2 bar-edit-icon"
                    onClick={toggleUpdateForm} />
                }
              </div>
            </>
          : null
        }
        <div className={item.product.unit === "count" ? "mr-auto" : "ml-auto"}>
          <span className="d-flex">
            <span>Quantity: {item.quantity}</span>
            <QuantityToggles increase={increaseQuantity} decrease={decreaseQuantity} />
          </span>
        </div>
        <div className="ml-2">
          <FontAwesomeIcon icon="trash" className="bar-item-delete" onClick={() => deleteItem(item.id)} />
        </div>
      </div>
    </ListGroupItem>
  )

}

export default BarItem

BarItem.propTypes = {
  item: PropTypes.object.isRequired,
  getInventory: PropTypes.func.isRequired
}