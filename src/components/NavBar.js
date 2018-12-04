import React, { Component } from 'react'
import { Link } from "react-router-dom"
import {
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink } from 'reactstrap'

class NavBar extends Component {

  render() {
    return (
      <Navbar color="light" expand="sm">
        <NavbarBrand tag={Link} to="/"><h3>Barkeeper</h3></NavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink tag={Link} to="/cocktails">Cocktails</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/bar">Bar Inventory</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/shopping-list">Shopping List</NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    )
  }

}

export default NavBar