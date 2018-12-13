const user = {

  getId() {
    return parseInt(sessionStorage.getItem("id"))
  },

  logout() {
    sessionStorage.clear()
  }

}

export default user