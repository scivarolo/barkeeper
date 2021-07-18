import {
    Button,
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
    useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { Formik, Field, Form } from 'formik'
import { IngredientSelector } from '@components/forms'

export default function AddProductModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Button onClick={onOpen}>Add Product</Button>
            <Modal onClose={onClose} size="lg" isOpen={isOpen}>
                <ModalOverlay>
                    <ModalContent>
                        <Formik
                            initialValues={{
                                name: '',
                                ingredientId: '',
                            }}
                            onSubmit={(values) => console.log(values)}>
                            <Form>
                                <ModalHeader>Add Product</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <FormControl>
                                        <FormLabel>Product Name</FormLabel>
                                        <Field as={Input} id="name" name="name" />
                                    </FormControl>
                                    <IngredientSelector name="ingredientId" label="Ingredient" />
                                </ModalBody>
                                <ModalFooter>
                                    <Button type="submit">Save</Button>
                                </ModalFooter>
                            </Form>
                        </Formik>
                    </ModalContent>
                </ModalOverlay>
            </Modal>
        </>
    )
}
