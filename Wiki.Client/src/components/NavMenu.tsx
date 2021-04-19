import React from 'react';
import { NavLink } from 'react-router-dom';

import { LoginMenu } from './ApiAuthorization/LoginMenu';
import { AppName } from 'src/constants';

import './NavMenu.scss';

function NavMenu() {
  return (
    <header className="nav-menu">
      <NavLink className="nav-menu__home" to="/">
        {AppName}
      </NavLink>
      <div className="flex-spacer" />
      <ul className="nav-menu__links">
        <LoginMenu></LoginMenu>
      </ul>
    </header>
  );
}

export default NavMenu;
