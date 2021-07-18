interface Error {
    error: string;
    stackTrace?: string;
    innerException?: string;
}

declare namespace Barkeeper {
    export interface Route {
        path: string;
        roles?: string[];
    }

    export interface RouteWithParams<TParams> extends Route {
        url: (params: TParams) => string;
    }
}ß