import React from 'react';
import { Route } from 'react-router';
import { Home } from '@components/Home';
import AuthorizeRoute from '@components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from '@components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from '@components/api-authorization/ApiAuthorizationConstants';
import Nav from "@components/Nav/Nav";
import { ChakraProvider, CSSReset, Box } from "@chakra-ui/core";
import theme from "@chakra-ui/theme";
import { InventoryView } from "@views";
import './custom.css'
import IngredientsManagerView from '@views/admin/ingredients/IngredientsManagerView';
import { useCurrentUser } from '@data/User';
import ProductsManagerView from '@views/admin/products/ProductsManagerView';


export default function App() {
    const { data: user } = useCurrentUser();
    return (
      <ChakraProvider theme={theme}>
      <CSSReset />
        <Nav />
        <Box m="1rem" p="1rem">
          <Route exact path='/' component={Home} />
          <AuthorizeRoute path="/bar" component={InventoryView} />
          {user?.name?.startsWith("scivarolo") && (<>
            <Route exact path="/admin/ingredients">
              <IngredientsManagerView />
            </Route>
            <Route exact path="/admin/products">
              <ProductsManagerView />
            </Route>
          </>)}
          <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
        </Box>
      </ChakraProvider>
    );
}

