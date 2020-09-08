import authService from "./../components/api-authorization/AuthorizeService";

class API {
    async GET<T>(endpoint: string): Promise<T> {
        const token = await authService.getAccessToken();
        const response = await fetch(endpoint, {
            headers: !token ? {} : { "Authorization": `Bearer ${token}` }
        });
        const data: T = await response.json();
        return data;
    }

    async POST<T, TResponse>(endpoint: string, body?: T): Promise<TResponse> {
        const token = await authService.getAccessToken();
        const response = await fetch(endpoint, {
            method: "POST",
            headers: !token ? {} : { "Authorization": `Bearer ${token}`, "Content-Type": "application/json"},
            body: body ? JSON.stringify(body) : null
        });
        const data: TResponse = await response.json();
        return data;
    }
}

export default new API();