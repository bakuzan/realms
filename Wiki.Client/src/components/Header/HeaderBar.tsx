import React from 'react';
import { NavLink } from 'react-router-dom';

import Header from 'meiko/Header';
import NavigationMenu from './NavigationMenu';

import { AppName } from 'src/constants';

import './HeaderBar.scss';

function HeaderBar() {
  return (
    <Header
      id="realms-header"
      navLeft={
        <h1 className="application-header__title">
          <NavLink
            className="application-header__brand"
            to="/"
            exact
            aria-label="Home"
          >
            <span aria-hidden={true}>{AppName}</span>
          </NavLink>
        </h1>
      }
      navRight={<NavigationMenu />}
    />
  );
}

export default HeaderBar;
