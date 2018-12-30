import React, { Component } from 'react'
import { Alert, AlertContainer } from 'react-bs-notifier'

class Alerts extends Component {

  render() {
    return (
      <AlertContainer>
        {
          this.props.showAlert
          ? ( <Alert type={this.props.alertType} headline={this.props.alertHeadline}>
                {this.props.alertMessage}
              </Alert> )
          : null
        }
      </AlertContainer>
    )
  }

}

export default Alerts