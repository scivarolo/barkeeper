import { useQuery } from 'react-query'
import API from '@data/API'

export function useUserProducts() {
    return useQuery<UserProduct[], Error>('user-products', () =>
        API.GET<UserProduct[]>('api/v1/userProducts')
    )
}
