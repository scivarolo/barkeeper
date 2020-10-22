import { useEffect, useState } from "react"
import authService from "@components/api-authorization/AuthorizeService"

/**
 * This hook checks whether a user is authorized
 */
export default function useIsAuthenticated() {

    const [ready, setReady] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);

    const populateAuthenticationState = async () => {
        const authenticated = await authService.isAuthenticated();
        setReady(true);
        setAuthenticated(authenticated);
    }

    const authenticationChanged = async () => {
        setReady(false);
        setAuthenticated(false);
        await populateAuthenticationState();
    }

    useEffect(() => {
        const subscription = authService.subscribe(() => authenticationChanged())
        populateAuthenticationState();
        return () => authService.unsubscribe(subscription)
        // eslint-disable-next-line
    }, []);

    return {
        isAuthenticated: authenticated,
        isReady: ready
    }
}