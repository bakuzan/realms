import React from 'react';
import { Component } from 'react';
import { Redirect } from 'react-router-dom';

import LoadingBouncer from 'meiko/LoadingBouncer';

import authService, { AuthState } from './AuthorizeService';
import { AuthenticationResultStatus } from './AuthorizeService';
import {
  QueryParameterNames,
  LogoutActions,
  ApplicationPaths
} from './ApiAuthorizationConstants';

interface LogoutProps {
  action: string;
}

interface LogoutState {
  authenticated: boolean;
  isReady: boolean;
  message: undefined | null | string | Error;
  redirectToHome: boolean;
}

// The main responsibility of this component is to handle the user's logout process.
// This is the starting point for the logout process, which is usually initiated when a
// user clicks on the logout button on the LoginMenu component.
export class Logout extends Component<LogoutProps, LogoutState> {
  private unsubAuthService = 0;

  constructor(props: LogoutProps) {
    super(props);

    this.state = {
      authenticated: false,
      isReady: false,
      message: undefined,
      redirectToHome: false
    };
  }

  componentDidMount() {
    const action = this.props.action;
    switch (action) {
      case LogoutActions.Logout:
        if (!!window.history.state.state.local) {
          this.logout(this.getReturnUrl());
        } else {
          // This prevents regular links to <app>/authentication/logout from triggering a logout
          this.setState({
            isReady: true,
            message: 'The logout was not initiated from within the page.'
          });
        }
        break;
      case LogoutActions.LogoutCallback:
        this.processLogoutCallback();
        break;
      case LogoutActions.LoggedOut:
        this.setState({
          isReady: true,
          message: 'You successfully logged out!',
          redirectToHome: true
        });
        break;
      default:
        throw new Error(`Invalid action '${action}'`);
    }

    this.populateAuthenticationState();
  }

  render() {
    const { isReady, message } = this.state;

    if (!isReady) {
      return <div></div>;
    }

    if (this.state.redirectToHome) {
      return <Redirect to="/" />;
    }

    if (!!message) {
      return <div>{message}</div>;
    } else {
      const action = this.props.action;
      switch (action) {
        case LogoutActions.Logout:
        case LogoutActions.LogoutCallback:
          return (
            <div>
              <LoadingBouncer />
            </div>
          );
        case LogoutActions.LoggedOut:
          return <Redirect to="/" />;
        default:
          throw new Error(`Invalid action '${action}'`);
      }
    }
  }

  public async logout(returnUrl: string) {
    const state = { returnUrl };
    const isauthenticated = await authService.isAuthenticated();

    if (isauthenticated) {
      const result = await authService.signOut(state);
      if (!result) return;

      switch (result.status) {
        case AuthenticationResultStatus.Redirect:
          break;
        case AuthenticationResultStatus.Success:
          await this.navigateToReturnUrl(returnUrl);
          break;
        case AuthenticationResultStatus.Fail:
          this.setState({ message: result['message'] });
          break;
        default:
          throw new Error('Invalid authentication result status.');
      }
    } else {
      this.setState({ message: 'You successfully logged out!' });
    }
  }

  public async processLogoutCallback() {
    const url = window.location.href;
    const result = await authService.completeSignOut(url);
    if (!result) return;

    switch (result.status) {
      case AuthenticationResultStatus.Redirect:
        // There should not be any redirects as the only time completeAuthentication finishes
        // is when we are doing a redirect sign in flow.
        throw new Error('Should not redirect.');
      case AuthenticationResultStatus.Success:
        await this.navigateToReturnUrl(this.getReturnUrl(result['state']));
        break;
      case AuthenticationResultStatus.Fail:
        this.setState({ message: result['message'] });
        break;
      default:
        throw new Error('Invalid authentication result status.');
    }
  }

  public async populateAuthenticationState() {
    const authenticated = await authService.isAuthenticated();
    this.setState({ isReady: true, authenticated });
  }

  public getReturnUrl(state?: AuthState) {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get(QueryParameterNames.ReturnUrl);
    if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
      // This is an extra check to prevent open redirects.
      throw new Error(
        'Invalid return url. The return url needs to have the same origin as the current page.'
      );
    }
    return (
      (state && state.returnUrl) ||
      fromQuery ||
      `${window.location.origin}${ApplicationPaths.LoggedOut}`
    );
  }

  public navigateToReturnUrl(returnUrl: string) {
    return window.location.replace(returnUrl);
  }
}
