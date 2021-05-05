import classNames from 'classnames';
import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

interface RealmLinkProps extends NavLinkProps {}

export default function RealmsLink(props: RealmLinkProps) {
  return (
    <NavLink
      {...props}
      className={classNames('realms-link', props.className)}
    />
  );
}
