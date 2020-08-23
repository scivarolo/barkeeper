/*
 * Wrapper Component for the notification system used throughout the app
 * Imported by Barkeeper.js
 */

import React from "react"
import PropTypes from "prop-types"
import { Alert, AlertContainer } from "react-bs-notifier"

export default function Alerts(props) {

  return (
    <AlertContainer>
      {
        props.showAlert
          ? ( <Alert type={props.alertType ? props.alertType : "success"} headline={props.alertHeadline}>
            {props.alertMessage}
          </Alert> )
          : null
      }
    </AlertContainer>
  )
}

Alerts.propTypes = {
  showAlert: PropTypes.bool,
  alertType: PropTypes.string,
  alertHeadline: PropTypes.string.isRequired,
  alertMessage: PropTypes.string.isRequired,
}