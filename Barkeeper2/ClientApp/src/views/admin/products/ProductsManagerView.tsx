import React from "react";
import { useAllProducts } from "@data/Products";
import { Box, Spinner } from "@chakra-ui/core";
import AddProductModal from "./AddProductModal";

export default function ProductsManagerView() {
    const {isLoading, data: products} = useAllProducts();

    return (<>
        <Box mb="1rem">
            <AddProductModal />
        </Box>
        <Box>
            {isLoading
                ? <Spinner />
                : products?.length > 0
                    ? products.map(product => <Box key={product.id}>{product.name}</Box>)
                    : "No Products Found"
            }
        </Box>
    </>)
}