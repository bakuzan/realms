import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';

import authService from './AuthorizeService';
import { ApplicationPaths } from './ApiAuthorizationConstants';

interface LoginMenuProps {}

interface LoginMenuState {
  isAuthenticated: boolean;
  userName: string;
}

interface LogoutPath {
  pathname: string;
  state: { local: boolean };
}

export class LoginMenu extends Component<LoginMenuProps, LoginMenuState> {
  private subscription: number = 0;

  constructor(props: LoginMenuProps) {
    super(props);

    this.state = {
      isAuthenticated: false,
      userName: ''
    };
  }

  componentDidMount() {
    this.subscription = authService.subscribe(() => this.populateState());
    this.populateState();
  }

  componentWillUnmount() {
    authService.unsubscribe(this.subscription);
  }

  async populateState() {
    const [isAuthenticated, user] = await Promise.all([
      authService.isAuthenticated(),
      authService.getUser()
    ]);

    this.setState({
      isAuthenticated: !!isAuthenticated,
      userName: user ? user.name ?? '' : ''
    });
  }

  render() {
    const { isAuthenticated, userName } = this.state;

    if (!isAuthenticated) {
      const registerPath = `${ApplicationPaths.Register}`;
      const loginPath = `${ApplicationPaths.Login}`;
      return this.anonymousView(registerPath, loginPath);
    } else {
      const profilePath = `${ApplicationPaths.Profile}`;
      const logoutPath = {
        pathname: `${ApplicationPaths.LogOut}`,
        state: { local: true }
      };
      return this.authenticatedView(userName, profilePath, logoutPath);
    }
  }

  authenticatedView(
    userName: string,
    profilePath: string,
    logoutPath: LogoutPath
  ) {
    return (
      <Fragment>
        <li>
          <NavLink className="text-dark" to={profilePath}>
            Hello {userName}
          </NavLink>
        </li>
        <li>
          <NavLink className="text-dark" to={logoutPath}>
            Logout
          </NavLink>
        </li>
      </Fragment>
    );
  }

  anonymousView(registerPath: string, loginPath: string) {
    return (
      <Fragment>
        <li>
          <NavLink className="text-dark" to={registerPath}>
            Register
          </NavLink>
        </li>
        <li>
          <NavLink className="text-dark" to={loginPath}>
            Login
          </NavLink>
        </li>
      </Fragment>
    );
  }
}
