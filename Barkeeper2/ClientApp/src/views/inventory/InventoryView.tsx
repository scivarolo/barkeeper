import { Heading, Spinner } from '@chakra-ui/core'
import React from 'react'
import { useUserProducts } from '@data/UserProducts'

export default function InventoryView() {
    const { isLoading, data } = useUserProducts()
    return (
        <>
            <Heading as="h1">Inventory</Heading>
            {isLoading ? (
                <Spinner />
            ) : data?.length > 0 ? (
                'We have inventory'
            ) : (
                'No products in your inventory'
            )}
        </>
    )
}
