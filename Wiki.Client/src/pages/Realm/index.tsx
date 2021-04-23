import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import AuthorizeRoute from 'src/components/ApiAuthorization/AuthorizeRoute';
import GuardResponseState from 'src/components/GuardResponseState';

import RealmView from './RealmView';
import RealmEditor from './RealmEditor';

import { useAsync } from 'src/hooks/useAsync';
import sendRequest from 'src/utils/sendRequest';

import { Realm } from 'src/interfaces/Realm';
import { PageProps } from 'src/interfaces/PageProps';

type RealmPageProps = PageProps<{ realmCode: string }>;

function RealmPage(props: RealmPageProps) {
  const realmCode = props.match.params.realmCode;
  const state = useAsync(
    async () => await sendRequest<Realm>(`realm/${realmCode}`),
    [realmCode]
  );

  return (
    <GuardResponseState state={state}>
      {(response) => {
        console.log('Realm > ', props, state);
        const realmName = response.name;

        return (
          <React.Fragment>
            <Helmet
              defaultTitle={realmName}
              titleTemplate={`%s | ${realmName}`}
            />

            <Switch>
              <AuthorizeRoute
                path="/:realmCode/edit"
                render={(rp) => {
                  const p = rp as RealmPageProps;
                  return <RealmEditor {...p} data={response} />;
                }}
              />
              <Route
                path="/:realmCode"
                render={(rp) => <RealmView {...rp} data={response} />}
              />
            </Switch>
          </React.Fragment>
        );
      }}
    </GuardResponseState>
  );
}

export default RealmPage;
