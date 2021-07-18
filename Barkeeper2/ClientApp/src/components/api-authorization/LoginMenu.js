import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import authService from './AuthorizeService';
import { ApplicationPaths } from './ApiAuthorizationConstants';
import { Button } from "@chakra-ui/core";

export class LoginMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            userName: null
        };
    }

    componentDidMount() {
        this._subscription = authService.subscribe(() => this.populateState());
        this.populateState();
    }

    componentWillUnmount() {
        authService.unsubscribe(this._subscription);
    }

    async populateState() {
        const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
        this.setState({
            isAuthenticated,
            userName: user?.name
        });
    }

    authenticatedView(userName, profilePath, logoutPath) {
        return (<>
            <Button as={Link} bg="transparent" to={profilePath}>Hello {userName}</Button>
            <Button as={Link} bg="transparent" border="1px" to={logoutPath}>Logout</Button>
        </>);

    }

    anonymousView(registerPath, loginPath) {
        return (<>
            <Button as={Link} bg="transparent" to={registerPath}>Register</Button>
            <Button as={Link} bg="transparent" border="1px" to={loginPath}>Login</Button>
        </>);
    }

    render() {
        const { isAuthenticated, userName } = this.state;
        if (!isAuthenticated) {
            const registerPath = `${ApplicationPaths.Register}`;
            const loginPath = `${ApplicationPaths.Login}`;
            return this.anonymousView(registerPath, loginPath);
        } else {
            const profilePath = `${ApplicationPaths.Profile}`;
            const logoutPath = { pathname: `${ApplicationPaths.LogOut}`, state: { local: true } };
            return this.authenticatedView(userName, profilePath, logoutPath);
        }
    }
}
