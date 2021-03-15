import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/core";
import React from "react";
import { Formik, Field, Form } from "formik";

export default function AddProductModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (<>
        <Button onClick={onOpen}>Add Product</Button>
        <Modal onClose={onClose} size="lg" isOpen={isOpen}>
            <ModalOverlay>
                <ModalContent>
                    <Formik
                        initialValues={{
                            name: "",
                        }}
                        onSubmit={values => console.log(values)}>
                        <Form>
                            <ModalHeader>
                                Add Product
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <FormControl>
                                    <FormLabel>Product Name</FormLabel>
                                    <Field as={Input} id="name" name="name" />
                                </FormControl>
                            </ModalBody>
                        </Form>
                    </Formik>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    </>)
}