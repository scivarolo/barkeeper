import { Box, Button, Spinner } from "@chakra-ui/core";
import React from "react";
import API from "../../../modules/API";
import { useQuery } from "react-query";
import AddIngredientModal from "./AddIngredientModal";

export default function IngredientsManagerView() {
    const { isLoading, data: ingredients } = useQuery("ingredients-all", () => API.GET<Ingredient[]>("api/v2/ingredients"))
    return (<>
        <Box mb="1rem">
            <AddIngredientModal />
        </Box>
        <Box>
            { isLoading
                ? <Spinner />
                : ingredients && ingredients.length > 0
                    ? ingredients.map(ingredient => <Box key={ingredient.id}>{ingredient.name}</Box>)
                    : "No Ingredients found"
            }
        </Box>
    </>)
}