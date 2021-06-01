import React from 'react';

import { LoginMenu } from '../ApiAuthorization/LoginMenu';
import ThemeToggler from 'src/components/ThemeToggler';

import './NavigationMenu.scss';

function NavMenu() {
  return (
    <ul className="nav-menu">
      <LoginMenu></LoginMenu>
      <li>
        <ThemeToggler />
      </li>
    </ul>
  );
}

export default NavMenu;
