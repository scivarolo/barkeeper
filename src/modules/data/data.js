import user from "./user"

const baseUrl = "http://localhost:8000/api"
const headers = {
  "Content-Type": "application/json",
  "Authorization": `Token ${user.getToken()}`
}
class API {

  // Fetch function builder used below.
  fetchFactory(url, method, body) {
    const fetchObj = { headers: headers }
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
    const url = `${baseUrl}/${resource}/${id}`
    return this.fetchFactory(url)
  }

  // Customize the search query with filters
  getFiltered(resource, filter_string) {
    const url = `${this.baseUrl}/${resource}/?${filter_string}`
    return this.fetchFactory(url)
  }

  // Saves a single resource entry
  save(resource, object) {
    const url = `${baseUrl}/${resource}/`
    return this.fetchFactory(url, "POST", object)
  }

  // Edits a single resource entry
  edit(resource, id, object) {
    const url = `${baseUrl}/${resource}/${id}`
    return this.fetchFactory(url, "PATCH", object)
  }

  // Deletes a single resource entry
  delete(resource, id) {
    const url = `${baseUrl}/${resource}/${id}`
    return this.fetchFactory(url, "DELETE")
  }

  // Send a search string with query
  search(resource, search_string, user_id) {
    const url = `${baseUrl}/${resource}/search=${search_string}`
    return this.fetchFactory(url)
  }
}

export default new API()