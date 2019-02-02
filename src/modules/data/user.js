const user = {

  getId() {
    return parseInt(1)
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