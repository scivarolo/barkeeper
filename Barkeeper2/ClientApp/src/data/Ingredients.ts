import { useQuery, useMutation, queryCache } from "react-query";
import API from "./API";

export function useAllIngredients() {
    return useQuery<Ingredient[], Error>("ingredients-all", () => API.GET<Ingredient[]>("api/v1/ingredients"));
}

export function useSaveIngredient(onClose?: any) {
    return useMutation<Ingredient, string, Partial<Ingredient>>(({ name, liquid }: any) => API.POST<Partial<Ingredient>, Ingredient>("api/v1/ingredients/save-new", {
        name,
        liquid
    }), {
        onSuccess: () => {
            queryCache.invalidateQueries("ingredients-all");
            onClose?.();
        },
    });
}