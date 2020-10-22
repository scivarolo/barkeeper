import { Heading, Spinner } from "@chakra-ui/core";
import React from "react";
import { useQuery } from "react-query";
import API from "../../data/API";

export default function InventoryView() {
    const { isLoading, data } = useQuery("user-products", () => API.GET<UserProduct>("api/v1/userProducts"));
    return (<>
        <Heading as="h1">Inventory</Heading>
        {isLoading && (
            <Spinner />
        )}
        {data && "We have data"}
    </>)
}