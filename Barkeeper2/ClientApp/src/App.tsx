import React from 'react'
import Nav from '@components/Nav/Nav'
import { ChakraProvider, CSSReset, Box } from '@chakra-ui/react'
import './custom.css'
import { BarkeeperRoutes } from '@routes'

export default function App() {
    return (
        <ChakraProvider>
            <CSSReset />
            <Nav />
            <Box m="1rem" p="1rem">
                <BarkeeperRoutes />
            </Box>
        </ChakraProvider>
    )
}
