import { useQuery, useMutation, useQueryClient } from "react-query";
import API from "./API";
import { gql } from "graphql-request";

export function useAllIngredientsLegacy() {
    return useQuery<Ingredient[], Error>("ingredients-all", () => API.GET<Ingredient[]>("api/v1/ingredients"));
}

export function useAllIngredients() {
    const query = gql`
        query {
            ingredients {
                id,
                name,
                liquid,
                createdById,
                createdDate
            }
        }
    `;
    return useQuery<any, Error, Ingredient[]>(["ingredients", "all"], () => API.GraphQLQuery<any>(query), {
        select: data => data?.ingredients as Ingredient[]
    })
}

export function useSaveIngredient(onClose?: any) {
    const queryClient = useQueryClient();

    const mutation = gql`
        mutation AddIngredient($input: AddIngredientInput!) {
            addIngredient(input: $input) {
                ingredient {
                    id,
                    name,
                    liquid,
                    createdById,
                    createdDate
                }
            }
        }
    `;

    return useMutation<Ingredient, string, Pick<Ingredient, "name" | "liquid">>((input) => API.GraphQLMutation<Ingredient>(mutation, { input }), {
        onSuccess: () => {
            queryClient.invalidateQueries("ingredients-all");
            onClose?.();
        },
    });
}