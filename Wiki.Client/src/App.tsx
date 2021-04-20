import classNames from 'classnames';
import React from 'react';
import { Route, Switch } from 'react-router';
import { Helmet } from 'react-helmet';

import ScrollTopButton from 'meiko/ScrollTopButton';
import { useGlobalStyles } from 'meiko/hooks/useGlobalStyles';

import HeaderBar from './components/Header/HeaderBar';

import Home from './pages/Home';
import NotFound from './pages/NotFound';

// import AuthorizeRoute from './components/ApiAuthorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/ApiAuthorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/ApiAuthorization/ApiAuthorizationConstants';
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

      <main>
        <Switch>
          <Route exact path="/" component={Home} />

          {/* <AuthorizeRoute path="/fetch-data" component={FetchData} /> */}

          {/* Below here are routes that should come last, and shouldn't be messed with */}
          <Route
            path={ApplicationPaths.ApiAuthorizationPrefix}
            component={ApiAuthorizationRoutes}
          />
          <Route path="*" component={NotFound} />
        </Switch>
      </main>

      <ScrollTopButton />
    </div>
  );
}

export default App;
