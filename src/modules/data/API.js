/*
 * Purpose: Highest Level API CLass in charge of get, creating, editing, and deleting data in the database
 */

class API {

  constructor() {
    this.baseUrl = "http://localhost:5002"
  }

  getAll(resource, userId, query) {
    let url = `${this.baseUrl}/${resource}?id_ne=false`
    if (query) url += query
    if (userId) url += `&userId=${userId}`
    return fetch(url).then(r => r.json())
  }

  get(resource, id) {
    return fetch(`${this.baseUrl}/${resource}/${id}`).then(r => r.json())
  }

  getWithEmbed(resource, embed, userId) {
    let url = `${this.baseUrl}/${resource}?_embed=${embed}&id_ne=false`
    if (userId) url += `&userId=${userId}`
    return fetch(url).then(r => r.json())
  }

  getWithExpands(resource, userId, ...expands) {
    let string = expands.reduce((string, expand) => `${string}&_expand=${expand}`, '')
    let url = `${this.baseUrl}/${resource}?${string}&id_ne=false`
    if (userId) url += `&userId=${userId}`
    return fetch(url).then(r => r.json())
  }

  getWithExpand(resource, expand, userId) {
    let url = `${this.baseUrl}/${resource}?_expand=${expand}&id_ne=false`
    if (userId) url += `&userId=${userId}`
    return fetch(url).then(r => r.json())
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

  query(resource, string, userId) {
    let url = `${this.baseUrl}/${resource}/?q=${string}`
    if (userId) url += `&userId=${userId}`
    return fetch(url).then(r => r.json())
  }

}

export default new API()