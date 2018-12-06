const user = {

  getId() {
    return parseInt(sessionStorage.get("id"))
  }

}

export default user