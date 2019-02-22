import user from "./user"

const baseUrl = "http://barkeeper-api.sebastiancivarolo.com/api"
const headers = {
  "Content-Type": "application/json",
  "Authorization": `Token ${user.getToken()}`
}
class API {

  // Fetch function builder used below.
  fetchFactory(url, method, body) {
    const fetchObj = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${user.getToken()}`
      }
    }
    if (method) fetchObj.method = method
    if (body) fetchObj.body = JSON.stringify(body)
    return fetch(url, fetchObj).then(r => r.json())
  }

  // Returns all data of a resource.
  // User-specific resources only return items based on the token.
  getAll(resource) {
    const url = `${baseUrl}/${resource}/`
    return this.fetchFactory(url)
  }

  // Returns a single entry from a resource.
  // Returns nothing if the user does not have access to that resource.
  getOne(resource, id) {
    const url = `${baseUrl}/${resource}/${id}/`
    return this.fetchFactory(url)
  }

  // Customize the search query with filters
  getFiltered(resource, filter_string) {
    const url = `${baseUrl}/${resource}/?${filter_string}`
    return this.fetchFactory(url)
  }

  // Saves a single resource entry
  save(resource, object) {
    const url = `${baseUrl}/${resource}/`
    return this.fetchFactory(url, "POST", object)
  }

  // Edits a single resource entry
  edit(resource, id, object) {
    const url = `${baseUrl}/${resource}/${id}/`
    return this.fetchFactory(url, "PATCH", object)
  }

  // Deletes a single resource entry
  delete(resource, id) {
    const url = `${baseUrl}/${resource}/${id}/`
    return fetch(url, {
      method: "DELETE",
      headers: headers
    })
  }

  // Send a search string with query
  search(resource, search_string) {
    const url = `${baseUrl}/${resource}/search=${search_string}`
    return this.fetchFactory(url)
  }
}

export default new API()