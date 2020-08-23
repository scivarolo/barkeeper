import { Box, Flex, Center, Heading } from "@chakra-ui/core";
import React, { useState } from "react";
import { LoginMenu } from "../api-authorization/LoginMenu";
import NavButton from "./NavButton";
import { Link } from "react-router-dom";
import useIsAuthenticated from "../../hooks/useIsAuthenticated";

export default function Nav() {
    const { isAuthenticated } = useIsAuthenticated();
    const [showMobileNav, setShowMobileNav] = useState(false);
    const handleToggle = () => setShowMobileNav(!showMobileNav);

    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            borderBottomWidth="1px"
            borderBottomColor="gray.200"
            padding="1rem 1.5rem">
            <Center mr="5">
                <Link to="/" style={{textDecoration: "none"}}>
                    <Heading as="h1" _hover={{color: "teal.700", textDecoration: "none"}} color="teal.500" size="lg" letterSpacing="0.01rem">Barkeeper 2</Heading>
                </Link>
            </Center>
            <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
                <svg
                    fill="teal.500"
                    width="12px"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <title>Menu</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
            </Box>
            {isAuthenticated && (
                <Flex
                    ml={{sm: "none", md: "auto"}}
                    display={{ sm: showMobileNav ? "flex" : "none", md: "flex" }}
                    flexDirection={{ sm: "column", md: "row"}}
                    width={{ sm: "full", md: "auto" }}
                    alignItems="center"
                    flexGrow={1}>
                    <NavButton
                        to="/"
                        label="Home"
                        activeOnlyWhenExact
                    />
                    <NavButton
                        to="/counter"
                        label="Counter"
                        activeOnlyWhenExact
                    />
                    <NavButton
                        to="/fetch-data"
                        label="Fetch Data"
                        activeOnlyWhenExact
                    />
                </Flex>
            )}
            <Box
                display={{ sm: showMobileNav ? "block" : "none", md: "block" }}
                ml="1rem"
                mt={{ base: 4, md: 0 }}>
                {/* <Button bg="transparent" border="1px">
                    Create account
                </Button> */}
                <LoginMenu />
            </Box>
        </Flex>

    )

}