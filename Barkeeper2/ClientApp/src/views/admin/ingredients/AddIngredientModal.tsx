import {
    Button,
    ButtonGroup,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Switch,
    useDisclosure,
} from "@chakra-ui/core";
import React, { useState } from "react";
import { useMutation } from "react-query";
import API from "../../../modules/API";

export default function AddIngredientModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [name, setName] = useState("");
    const [isLiquid, setIsLiquid] = useState(true);

    const [
        mutate,
        { isIdle, isLoading, isError, isSuccess, data, error }
    ] = useMutation(({ name, liquid }: any) => API.POST<Partial<Ingredient>, Ingredient>("api/v2/ingredients/save-new", {
        name,
        liquid
    }));

    const onSaveIngredient = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            console.log("save")
            await mutate({ name, liquid: isLiquid })
        } catch ( error ) {

        }
    }

    return (
        <>
            <Button onClick={onOpen}>Add Ingredient</Button>
            <Modal onClose={onClose} size="lg" isOpen={isOpen}>
                <ModalOverlay>
                    <ModalContent>
                            <form>
                        <ModalHeader>Add Ingredient</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                                <FormControl id="name">
                                    <FormLabel>Ingredient Name</FormLabel>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl id="name">
                                    <FormLabel>Liquid?</FormLabel>
                                    <Switch
                                        isChecked={isLiquid}
                                        onChange={() => setIsLiquid(!isLiquid)}
                                    />
                                </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <ButtonGroup>
                                <Button onClick={onClose}>Cancel</Button>
                                <Button isLoading={isLoading} colorScheme="teal" onClick={(e) => onSaveIngredient(e)}>Save</Button>
                            </ButtonGroup>
                        </ModalFooter>
                            </form>
                    </ModalContent>
                </ModalOverlay>
            </Modal>
        </>
    )
}