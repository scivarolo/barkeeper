const user = {

  getId() {
    return parseInt(sessionStorage.getItem("id"))
  },

  getToken() {
    return parseInt(localStorage.getItem("token"))
  },

  logout() {
    sessionStorage.clear()
    localStorage.clear()
  }

}

export default user