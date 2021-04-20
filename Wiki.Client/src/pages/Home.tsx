import React from 'react';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';

import ResponseGrid from 'src/components/ResponseGrid';

import { useAsync } from 'src/hooks/useAsync';
import sendRequest from 'src/utils/sendRequest';

import { Realm } from 'src/interfaces/Realm';

import './Home.scss';

function Home(props: any) {
  const state = useAsync(
    async () => await sendRequest<Realm[]>('realm/getall'),
    []
  );

  console.log('Home Hub > ', props, state);

  return (
    <div>
      <Helmet title="Hub" />
      <h2>Realms Hub</h2>
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
