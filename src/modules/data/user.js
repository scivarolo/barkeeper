/*
* Handles retrieving the user token from localStorage, and logging out a user
*/

const user = {

  getId() {
    return localStorage.getItem("user_id")
  },

  getUsername() {
    return localStorage.getItem("username")
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