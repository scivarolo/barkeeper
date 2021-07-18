import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import React from 'react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { NavLink, useRouteMatch } from 'react-router-dom'
import { useCurrentUser } from '@data/User'
import { Routes } from '@routes'

export default function AdminMenu() {
    const user = useCurrentUser()
    let match = useRouteMatch({
        path: Routes.admin.path,
    })
    if (user.data?.name?.startsWith('scivarolo')) {
        return (
            <Menu>
                <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    colorScheme="teal"
                    variant={match ? 'solid' : 'ghost'}>
                    Admin
                </MenuButton>
                <MenuList>
                    <MenuItem as={NavLink} to={Routes.admin.ingredients.path}>
                        Ingredients
                    </MenuItem>
                    <MenuItem as={NavLink} to={Routes.admin.products.path}>
                        Products
                    </MenuItem>
                </MenuList>
            </Menu>
        )
    } else {
        return null
    }
}
