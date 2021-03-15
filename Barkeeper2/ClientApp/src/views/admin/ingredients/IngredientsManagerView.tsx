import { Box, Spinner } from "@chakra-ui/core";
import React from "react";
import AddIngredientModal from "./AddIngredientModal";
import { useAllIngredients } from "@data/Ingredients";

export default function IngredientsManagerView() {
    const { isLoading, data: ingredients } = useAllIngredients();
    return (<>
        <Box mb="1rem">
            <AddIngredientModal />
        </Box>
        <Box>
            { isLoading
                ? <Spinner />
                : ingredients?.length > 0
                    ? ingredients.map(ingredient => <Box key={ingredient.id}>{ingredient.name}</Box>)
                    : "No Ingredients found"
            }
        </Box>
    </>)
}