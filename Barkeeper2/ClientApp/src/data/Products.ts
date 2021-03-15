import { useQuery } from "react-query";
import API from "./API";

export function useAllProducts() {
    return useQuery<Product[], Error>("api/v1/products", (url: string) => API.GET<Product[]>(url));
}