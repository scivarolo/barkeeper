/*
 * Purpose: Highest Level API CLass in charge of get, creating, editing, and deleting data in the database
 */

class API {

  constructor() {
    this.baseUrl = "http://localhost:5002"
  }

  getAll(resource) {
    return fetch(`${this.baseUrl}/${resource}`)
    .then(r => r.json())
  }

  get(resource, id) {
    return fetch(`${this.baseUrl}/${resource}/${id}`)
    .then(r => r.json())
  }

  saveData(resource, object) {
    return fetch(`${this.baseUrl}/${resource}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(object)
    }).then(r => r.json())
  }

  editData(resource, id, object) {
    return fetch(`${this.baseUrl}/${resource}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(object)
    }).then(r => r.json())
  }

  deleteData(resource, id) {
    return fetch(`${this.baseUrl}/${resource}/${id}`, {
      method: "DELETE"
    })
  }

}

export default new API()