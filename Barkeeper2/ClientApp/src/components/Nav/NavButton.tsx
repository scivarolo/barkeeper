import React from 'react'
import { Button } from '@chakra-ui/core'
import { NavLink, useRouteMatch } from 'react-router-dom'

interface NavButtonProps {
    to: string
    activeOnlyWhenExact?: boolean
    label: string
}

export default function NavButton({ to, activeOnlyWhenExact = false, label }: NavButtonProps) {
    let match = useRouteMatch({
        path: to,
        exact: activeOnlyWhenExact,
    })

    return (
        <NavLink to={to} style={{ textDecoration: 'none' }}>
            <Button
                ml={{ md: 'auto' }}
                mr="0.25rem"
                colorScheme="teal"
                variant={!match ? 'ghost' : 'solid'}>
                {label}
            </Button>
        </NavLink>
    )
}
