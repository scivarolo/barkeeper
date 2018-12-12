import React, { Component } from 'react'
import './bartab.scss'

class BarTab extends Component {

  state = {

  }

  render() {

    if (this.props.userTab && this.props.userTab.length) {

      return (
        <div className="sticky-top bartab--offset bartab__wrapper">
          <h1>Bar Tab</h1>
          <p>You have cocktails in your tab but Barkeeper can't display them yet. Check back soon!</p>
        </div>
      )

    } else {

      return (
        <div className="sticky-top bartab--offset bartab__wrapper">
          <h1>Bar Tab</h1>
          <p>You don't have any cocktails in your tab right now. Add some!</p>
        </div>
      )

    }

  }

}

export default BarTab