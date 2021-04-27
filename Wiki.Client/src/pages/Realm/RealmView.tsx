import React from 'react';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';

import TagCloudSelector from 'meiko/TagCloudSelector';
import GuardWithAuthorisation from 'src/components/GuardWithAuthorisation';

import { RealmView } from 'src/interfaces/Realm';
import { PageProps } from 'src/interfaces/PageProps';
import TitleSeparator from 'src/components/TitleSeparator';

interface RealmViewProps extends PageProps<{ realmCode: string }> {
  data: RealmView;
}

function RealmViewPage(props: RealmViewProps) {
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
      <div className="page__content">
        more content to follow...
        <div>
          <TitleSeparator title="Tags" />
          <TagCloudSelector
            className="rlm-tag-cloud"
            tagClass="rlm-tag"
            name="tags"
            tagOptions={data.tags.map((x) => ({ id: x.id ?? 0, name: x.name }))}
            onSelect={() =>
              console.log(
                '%c TODO > Make this go to a page of realms with this tag...',
                'color:red; font-size:18px;'
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

export default RealmViewPage;
