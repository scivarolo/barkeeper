/*
* Handles retrieving the user token from localStorage, and logging out a user
*/

const user = {

  getId() {
    return parseInt(1)
  },

  getToken() {
    return localStorage.getItem("token")
  },

  logout() {
    sessionStorage.clear()
    localStorage.clear()
  }

}

export default user