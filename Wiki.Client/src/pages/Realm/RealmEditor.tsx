import React from 'react';
import { Helmet } from 'react-helmet';

import GuardResponseState from 'src/components/GuardResponseState';

import { useAsync } from 'src/hooks/useAsync';
import sendRequest from 'src/utils/sendRequest';

import { Realm } from 'src/interfaces/Realm';
import { PageProps } from 'src/interfaces/PageProps';

function RealmEditor(props: PageProps<{ realmCode: string }>) {
  const realmCode = props.match.params.realmCode;
  const state = useAsync(
    async () => await sendRequest<Realm>(`realm/${realmCode}`),
    [realmCode]
  );

  return (
    <GuardResponseState state={state}>
      {(response) => {
        console.log('RealmEditor > ', props, state);
        const realmName = response.name;

        return (
          <div className="page">
            <Helmet title={`Editing ${realmName}`} />
            <header className="page__header">
              <h2>{realmName} Hub</h2>
            </header>
          </div>
        );
      }}
    </GuardResponseState>
  );
}

export default RealmEditor;
