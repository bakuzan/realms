import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import AuthorizeRoute from 'src/components/ApiAuthorization/AuthorizeRoute';
import GuardResponseState from 'src/components/GuardResponseState';

import RealmViewPage from './Realm/RealmView';
import RealmEditor from './Realm/RealmEditor';
import FragmentFormView from './Fragment/FragmentFormView';
import FragmentView from './Fragment/FragmentView';

import { useAsyncFn } from 'src/hooks/useAsyncFn';
import sendRequest from 'src/utils/sendRequest';

import { RealmView } from 'src/interfaces/Realm';
import { PageProps } from 'src/interfaces/PageProps';

type RealmPageProps = PageProps<{ realmCode: string }>;

function RealmPage(props: RealmPageProps) {
  const realmCode = props.match.params.realmCode;

  const [state, fetchRealmView] = useAsyncFn(
    async () => await sendRequest<RealmView>(`realm/${realmCode}`),
    [realmCode]
  );

  useEffect(() => {
    fetchRealmView();
  }, [fetchRealmView]);

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
                  return (
                    <RealmEditor
                      {...p}
                      data={response}
                      onUpdate={fetchRealmView}
                    />
                  );
                }}
              />
              <Route
                exact
                path="/:realmCode"
                render={(rp) => <RealmViewPage {...rp} data={response} />}
              />
              <Route
                path={[
                  '/:realmCode/new-fragment',
                  '/:realmCode/:fragmentCode/edit'
                ]}
                render={(fp) => <FragmentFormView {...fp} data={response} />}
              />
              <Route
                path="/:realmCode/:fragmentCode"
                render={(rp) => <FragmentView {...rp} data={response} />}
              />
            </Switch>
          </React.Fragment>
        );
      }}
    </GuardResponseState>
  );
}

export default RealmPage;
