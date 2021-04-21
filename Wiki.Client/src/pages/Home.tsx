import React from 'react';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';

import ResponseGrid from 'src/components/ResponseGrid';

import { useAsync } from 'src/hooks/useAsync';
import sendRequest from 'src/utils/sendRequest';

import { Realm } from 'src/interfaces/Realm';
import { AppName } from 'src/constants';

import './Home.scss';
import GuardWithAuthorisation from 'src/components/GuardWithAuthorisation';

function Home(props: any) {
  const state = useAsync(
    async () => await sendRequest<Realm[]>('realm/getall'),
    []
  );

  console.log('Home Hub > ', props, state);

  return (
    <div className="home">
      <Helmet title="Hub" />
      <header className="home__header">
        <h2>{AppName} Hub</h2>
        <GuardWithAuthorisation>
          <NavLink className="add-realm" to={`/new-realm`}>
            Add Realm
          </NavLink>
        </GuardWithAuthorisation>
      </header>
      <ResponseGrid
        data={state}
        filterFn={(filter: string) => (x: Realm) =>
          x.name.includes(filter) || x.code.includes(filter)}
      >
        {(x: Realm) => (
          <li key={x.id} className="realm">
            <NavLink className="realm__link" to={`/${x.code}`}>
              {x.name}
            </NavLink>
            <div>Pages: {1}</div>
          </li>
        )}
      </ResponseGrid>
    </div>
  );
}

export default Home;
