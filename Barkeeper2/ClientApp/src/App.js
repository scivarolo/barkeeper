import React from 'react';
import { Route } from 'react-router';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import Nav from "./components/Nav/Nav";
import { ChakraProvider, CSSReset, Box } from "@chakra-ui/core";
import theme from "@chakra-ui/theme";

import './custom.css'

export default function App() {
    return (
      <ChakraProvider theme={theme}>
        <CSSReset />
        <Nav />
        <Box m="1rem" p="1rem">
          <Route exact path='/' component={Home} />
          <Route path='/counter' component={Counter} />
          <AuthorizeRoute path='/fetch-data' component={FetchData} />
          <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
        </Box>
      </ChakraProvider>
    );
}

