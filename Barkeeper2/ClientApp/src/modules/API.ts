import authService from "./../components/api-authorization/AuthorizeService";

class API {
    async get(endpoint: string) {
        const token = await authService.getAccessToken();
        const response = await fetch(endpoint, {
            headers: !token ? {} : { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        return data;
    }
}

export default new API();