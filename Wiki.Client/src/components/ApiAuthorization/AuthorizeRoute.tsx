import React from 'react';
import { Component } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

import {
  ApplicationPaths,
  QueryParameterNames
} from './ApiAuthorizationConstants';
import authService from './AuthorizeService';

interface AuthoriseRouteProps extends RouteProps {}

interface AuthoriseRouteState {
  ready: boolean;
  authenticated: boolean;
}

export default class AuthoriseRoute extends Component<
  AuthoriseRouteProps,
  AuthoriseRouteState
> {
  private subscription: number = 0;

  constructor(props: AuthoriseRouteProps) {
    super(props);

    this.state = {
      ready: false,
      authenticated: false
    };
  }

  componentDidMount() {
    this.subscription = authService.subscribe(() =>
      this.authenticationChanged()
    );
    this.populateAuthenticationState();
  }

  componentWillUnmount() {
    authService.unsubscribe(this.subscription);
  }

  getRedirectUrl() {
    const link = document.createElement('a');
    link.href =
      this.props.path === undefined
        ? ''
        : typeof this.props.path === 'string'
        ? this.props.path
        : this.props.path[0];

    const returnUrl = `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`;
    return `${ApplicationPaths.Login}?${
      QueryParameterNames.ReturnUrl
    }=${encodeURI(returnUrl)}`;
  }

  render() {
    const { ready, authenticated } = this.state;
    const redirectUrl = this.getRedirectUrl();

    if (!ready) {
      return <div></div>;
    } else {
      const { component, render, ...rest } = this.props;
      const PageComponent = (render
        ? render
        : component) as React.ComponentClass;

      return (
        <Route
          {...rest}
          render={(props) => {
            if (authenticated) {
              return <PageComponent {...props} />;
            } else {
              return <Redirect to={redirectUrl} />;
            }
          }}
        />
      );
    }
  }

  async populateAuthenticationState() {
    const authenticated = await authService.isAuthenticated();
    this.setState({ ready: true, authenticated });
  }

  async authenticationChanged() {
    this.setState({ ready: false, authenticated: false });
    await this.populateAuthenticationState();
  }
}
