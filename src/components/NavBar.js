import React, { Component } from 'react'
import { Link } from "react-router-dom"
import {
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink } from 'reactstrap'
import user from '../modules/data/user';

class NavBar extends Component {

  render() {
    return (
      <Navbar color="primary" expand="sm">
        <NavbarBrand tag={Link} to="/"><h3 className="text-white">Barkeeper</h3></NavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink className="text-white" tag={Link} to="/cocktails">Cocktails</NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="text-white" tag={Link} to="/bar">Bar Inventory</NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="text-white" tag={Link} to="/shopping-list">Shopping List</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/" className="text-white" onClick={() => {
              user.logout()
              this.props.authenticate()
            }} >Logout</NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    )
  }

}

export default NavBar