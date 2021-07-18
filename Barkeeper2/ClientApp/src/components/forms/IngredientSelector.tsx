import { FormControl, FormLabel } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { Select } from '@components/forms'
import { useAllIngredients } from '@data/Ingredients'
import { useField, useFormikContext } from 'formik'

interface IngredientSelectorProps {
    name: string
    label: string
}

export default function IngredientSelector({ name }: IngredientSelectorProps) {
    const [field, meta] = useField(name)
    const formik = useFormikContext()
    const ingredients = useAllIngredients()
    const options = useMemo(() => {
        return (
            ingredients.data?.map((ingredient) => ({
                value: ingredient.id,
                label: ingredient.name,
            })) ?? []
        )
    }, [ingredients.data])

    return (
        <FormControl>
            <FormLabel>Ingredient</FormLabel>
            <Select
                options={options}
                value={options.find((option) => option.value === field.value)}
                onChange={(value) => formik.setFieldValue(name, value.value)}
            />
        </FormControl>
    )
}
