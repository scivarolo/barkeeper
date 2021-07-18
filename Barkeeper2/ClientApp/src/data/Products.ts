import { useQuery } from 'react-query'
import API from './API'

export function useAllProducts() {
    const url = 'api/v1/products'
    return useQuery<Product[], Error>([url], () => API.GET<Product[]>(url))
}