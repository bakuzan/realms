import React from 'react';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';

import GuardWithAuthorisation from 'src/components/GuardWithAuthorisation';

import { Realm } from 'src/interfaces/Realm';
import { PageProps } from 'src/interfaces/PageProps';

interface RealmViewProps extends PageProps<{ realmCode: string }> {
  data: Realm;
}

function RealmView(props: RealmViewProps) {
  const { data } = props;
  const realmName = data.name;

  console.log('Realm Page > ', props);

  return (
    <div className="page">
      <Helmet title={`Hub`} />
      <header className="page__header">
        <h2>{realmName} Hub</h2>
        <GuardWithAuthorisation ownerUserId={data.realmOwnerUserId}>
          <NavLink to={`${props.match.url}/edit`}>Edit</NavLink>
        </GuardWithAuthorisation>
      </header>
    </div>
  );
}

export default RealmView;
