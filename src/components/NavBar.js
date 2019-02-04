import React from 'react'
import { NavLink as RouterNavLink } from "react-router-dom"
import {
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink } from 'reactstrap'
import user from '../modules/data/user'
import './navBar.scss'

function NavBar(props) {

  return (
    <Navbar color="primary" expand="sm">
      <NavbarBrand tag={RouterNavLink} to="/"><h3 className="text-white">Barkeeper</h3></NavbarBrand>
      <Nav className="ml-auto" navbar>
        <NavItem>
          <NavLink className="text-white" tag={RouterNavLink} to="/cocktails">Cocktails</NavLink>
        </NavItem>
        <NavItem>
          <NavLink className="text-white" tag={RouterNavLink} to="/bar">Bar Inventory</NavLink>
        </NavItem>
        <NavItem>
          <NavLink className="text-white" tag={RouterNavLink} to="/shopping-list">Shopping List</NavLink>
        </NavItem>
        <NavItem>
          <NavLink className="text-white" onClick={() => {
            user.logout()
            props.authenticate()
          }}>Logout</NavLink>
        </NavItem>
      </Nav>
    </Navbar>
  )
}

export default NavBar