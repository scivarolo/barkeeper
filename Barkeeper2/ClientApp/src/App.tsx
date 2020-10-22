import React from 'react';
import { Route } from 'react-router';
import { Home } from '@components/Home';
import AuthorizeRoute from '@components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from '@components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from '@components/api-authorization/ApiAuthorizationConstants';
import Nav from "@components/Nav/Nav";
import { ReactQueryConfigProvider, useQuery } from "react-query";
import { ChakraProvider, CSSReset, Box } from "@chakra-ui/core";
import theme from "@chakra-ui/theme";
import { InventoryView } from "@views";
import './custom.css'
import authService from '@components/api-authorization/AuthorizeService';
import { Profile } from 'oidc-client';
import IngredientsManagerView from '@views/admin/ingredients/IngredientsManagerView';

const queryConfig = {
  queries: {
    refetchOnWindowFocus: false
  }
}

export default function App() {
    const { data: user } = useQuery<Profile>("active-user", () => authService.getUser());
    return (
      <ChakraProvider theme={theme}>
        <CSSReset />
        <ReactQueryConfigProvider config={queryConfig}>
          <Nav />
          <Box m="1rem" p="1rem">
            <Route exact path='/' component={Home} />
            <AuthorizeRoute path="/bar" component={InventoryView} />
            {user?.name?.startsWith("scivarolo") && (
              <Route exact path="/admin/ingredients">
                <IngredientsManagerView />
              </Route>
            )}
            <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
          </Box>
        </ReactQueryConfigProvider>
      </ChakraProvider>
    );
}

