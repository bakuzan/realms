import React from 'react';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';

import GuardResponseState from 'src/components/GuardResponseState';
import GuardWithAuthorisation from 'src/components/GuardWithAuthorisation';

import { useAsync } from 'src/hooks/useAsync';
import sendRequest from 'src/utils/sendRequest';

import { Realm } from 'src/interfaces/Realm';
import { PageProps } from 'src/interfaces/PageProps';

function RealmPage(props: PageProps<{ realmCode: string }>) {
  const realmCode = props.match.params.realmCode;
  const state = useAsync(
    async () => await sendRequest<Realm>(`realm/${realmCode}`),
    [realmCode]
  );

  return (
    <GuardResponseState state={state}>
      {(response) => {
        console.log('Realm Page > ', props, state);
        const realmName = response.name;

        return (
          <div>
            <Helmet title={`${realmName} Hub`} />
            <header>
              <h2>{realmName} Hub</h2>
              <GuardWithAuthorisation ownerUserId={response.realmOwnerUserId}>
                <NavLink to={`${props.match.url}/edit`}>Edit</NavLink>
              </GuardWithAuthorisation>
            </header>
          </div>
        );
      }}
    </GuardResponseState>
  );
}

export default RealmPage;
