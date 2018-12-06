const user = {

  getId() {
    return parseInt(sessionStorage.getItem("id"))
  }

}

export default user