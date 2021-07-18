import { ApplicationPaths } from "@components/api-authorization/ApiAuthorizationConstants";
import ApiAuthorizationRoutes from "@components/api-authorization/ApiAuthorizationRoutes";
import AuthorizeRoute from "@components/api-authorization/AuthorizeRoute";
import { Home } from "@components/Home";
import { useCurrentUser } from "@data/User";
import { InventoryView } from "@views";
import IngredientsManagerView from "@views/admin/ingredients/IngredientsManagerView";
import ProductsManagerView from "@views/admin/products/ProductsManagerView";
import React from 'react';
import { Route } from 'react-router';
import Routes from "./Routes";

export default function BarkeeperRoutes() {
    const { data: user } = useCurrentUser();

    return <>
        <Route exact path='/' component={Home} />
        <AuthorizeRoute path={Routes.bar.path} component={InventoryView} />
        {user?.name?.startsWith("scivarolo") && (<>
            <AuthorizeRoute exact path={Routes.admin.ingredients.path}>
                <IngredientsManagerView />
            </AuthorizeRoute>
            <AuthorizeRoute exact path={Routes.admin.products.path}>
                <ProductsManagerView />
            </AuthorizeRoute>
        </>)}
        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
    </>
}