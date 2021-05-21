import classNames from 'classnames';
import React from 'react';
import { Route, Switch } from 'react-router';
import { Helmet } from 'react-helmet';

import ScrollTopButton from 'meiko/ScrollTopButton';
import { useGlobalStyles } from 'meiko/hooks/useGlobalStyles';

import HeaderBar from './components/Header/HeaderBar';

import Home from './pages/Home';
import RealmHub from './pages/RealmHub';
import RealmCreator from './pages/Realm/RealmCreator';
import TagPage from './pages/Tag';
import NotFound from './pages/NotFound';

import AuthorizeRoute from './components/ApiAuthorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/ApiAuthorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/ApiAuthorization/ApiAuthorizationConstants';
import Alert from 'src/components/Alert';
import { AppName } from './constants';

import './styles/index.scss';
import './styles/theme.scss';

function App() {
  useGlobalStyles();

  return (
    <div
      className={classNames('theme', {
        'theme--alt': false,
        'theme--default': true
      })}
    >
      <Helmet defaultTitle={AppName} titleTemplate={`%s | ${AppName}`} />
      <HeaderBar />
      <Alert />
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            path={ApplicationPaths.ApiAuthorizationPrefix}
            component={ApiAuthorizationRoutes}
          />

          <Route
            exact
            path={['/by-tag', '/by-tag/:realmCode']}
            component={TagPage}
          />
          <AuthorizeRoute exact path="/new-realm" component={RealmCreator} />
          <Route path="/:realmCode" component={RealmHub} />

          {/* Below here are routes that should come last, and shouldn't be messed with */}
          <Route path="*" component={NotFound} />
        </Switch>
      </main>
      <ScrollTopButton />
    </div>
  );
}

export default App;
