import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/core";
import React from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { NavLink } from "react-router-dom";
import { useCurrentUser } from "@data/User";

export default function AdminMenu() {
    const user = useCurrentUser();

    if (user.data?.name?.startsWith("scivarolo")) {
        return (
            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Admin
                </MenuButton>
                <MenuList>
                    <MenuItem as={NavLink} to="/admin/ingredients">Ingredients</MenuItem>
                    <MenuItem as={NavLink} to="/admin/products">Products</MenuItem>
                </MenuList>
            </Menu>
        )
    } else {
        return null;
    }
}