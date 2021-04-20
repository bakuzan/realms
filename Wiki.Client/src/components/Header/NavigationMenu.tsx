import React from 'react';

import { LoginMenu } from '../ApiAuthorization/LoginMenu';

import './NavigationMenu.scss';

function NavMenu() {
  return (
    <ul className="nav-menu">
      <LoginMenu></LoginMenu>
    </ul>
  );
}

export default NavMenu;
