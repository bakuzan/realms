import classNames from 'classnames';
import React, { useState } from 'react';

import { Helmet } from 'react-helmet';

import ClearableInput from 'meiko/ClearableInput';
import Grid from 'meiko/Grid';
import GuardWithAuthorisation from 'src/components/GuardWithAuthorisation';
import GuardResponseState from 'src/components/GuardResponseState';
import RealmsLink from 'src/components/RealmsLink';

import { useAsync } from 'src/hooks/useAsync';
import sendRequest from 'src/utils/sendRequest';

import { RealmItem } from 'src/interfaces/Realm';
import { AppName } from 'src/constants';

import './Home.scss';

function Home(props: any) {
  const [filter, setFilter] = useState('');

  const state = useAsync(
    async () => await sendRequest<RealmItem[]>('realm/getall'),
    []
  );

  console.log('Home Hub > ', props, state);

  return (
    <div className="home">
      <Helmet title="Hub" />
      <header className="home__header">
        <h2>{AppName} Hub</h2>
        <GuardWithAuthorisation>
          <RealmsLink className="add-realm" to={`/new-realm`}>
            Add Realm
          </RealmsLink>
        </GuardWithAuthorisation>
      </header>
      <GuardResponseState state={state}>
        {(response) => {
          console.log('Hub Response > ', props, state);

          const hasFilter = !!filter;
          const filterLower = filter.toLowerCase();
          const noItemsText = !hasFilter
            ? 'No items'
            : 'No items found for current filter';

          const filteredItems = response.filter(
            (x: RealmItem) =>
              x.name.includes(filterLower) || x.code.includes(filterLower)
          );

          return (
            <div>
              <div>
                <ClearableInput
                  id="filter"
                  name="filter"
                  value={filter}
                  label="Filter realms"
                  aria-label="Enter text to filter on realms on name or code"
                  onKeyPress={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    const el = e.target as HTMLInputElement;
                    setFilter(el.value);
                  }}
                />
              </div>

              <Grid
                className={classNames('realms', {
                  'realms--empty': filteredItems.length === 0
                })}
                items={filteredItems}
                noItemsText={noItemsText}
              >
                {(x: RealmItem) => {
                  const fragmentText = x.fragmentCount === 1 ? 'page' : 'pages';

                  return (
                    <li key={x.id} className="realm">
                      <RealmsLink className="realm__link" to={`/${x.code}`}>
                        {x.name}
                      </RealmsLink>
                      <div>
                        {x.fragmentCount
                          ? `${x.fragmentCount} ${fragmentText}`
                          : `No pages`}
                      </div>
                    </li>
                  );
                }}
              </Grid>
            </div>
          );
        }}
      </GuardResponseState>
    </div>
  );
}

export default Home;
