import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { LoginMenu } from './ApiAuthorization/LoginMenu';

import './NavMenu.scss';

export class NavMenu extends Component<any> {
  static displayName = NavMenu.name;

  render() {
    return (
      <header>
        <NavLink to="/">Wiki</NavLink>
        <ul>
          <li>
            <NavLink className="text-dark" to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink className="text-dark" to="/counter">
              Counter
            </NavLink>
          </li>
          <li>
            <NavLink className="text-dark" to="/fetch-data">
              Fetch data
            </NavLink>
          </li>
          <LoginMenu></LoginMenu>
        </ul>
      </header>
    );
  }
}
