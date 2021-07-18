export interface RouteConfig {
    admin: Barkeeper.Route & {
        ingredients: Barkeeper.Route
        products: Barkeeper.Route
    }
}

const Routes = {
    admin: {
        path: '/admin',
        ingredients: {
            path: '/admin/ingredients',
        },
        products: {
            path: '/admin/products',
        },
    },
    bar: {
        path: '/bar',
    },
}

export default Routes;