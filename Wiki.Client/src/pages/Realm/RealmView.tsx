import React from 'react';
import { Helmet } from 'react-helmet';

import { Button } from 'meiko/Button';
import TagCloudSelector from 'meiko/TagCloudSelector';
import GuardWithAuthorisation from 'src/components/GuardWithAuthorisation';
import TitleSeparator from 'src/components/TitleSeparator';
import RealmsLink from 'src/components/RealmsLink';
import RealmGroups from 'src/components/RealmGroups';

import { RealmView } from 'src/interfaces/Realm';
import { PageProps } from 'src/interfaces/PageProps';

interface RealmViewProps extends PageProps<{ realmCode: string }> {
  data: RealmView;
}

function RealmViewPage(props: RealmViewProps) {
  const { data } = props;
  const realmName = data.name;

  return (
    <div className="page">
      <Helmet title={`Hub`} />
      <header className="page__header">
        <h2 className="page__title">{realmName} Hub</h2>
        <GuardWithAuthorisation
          isPrivate={data.isPrivate}
          ownerUserId={data.realmOwnerUserId}
        >
          <div className="button-group">
            <RealmsLink to={`${props.match.url}/edit`}>Edit</RealmsLink>
            <Button
              className="rlm-false-link"
              onClick={() => props.history.goBack()}
            >
              Back
            </Button>
          </div>
        </GuardWithAuthorisation>
      </header>
      <div className="page__action-bar">
        <div className="flex-spacer"></div>
        <GuardWithAuthorisation
          isPrivate={data.isPrivate}
          ownerUserId={data.realmOwnerUserId}
        >
          <RealmsLink to={`${props.match.url}/new-fragment`}>
            Add Fragment
          </RealmsLink>
        </GuardWithAuthorisation>
      </div>
      <div className="page__content">
        <RealmGroups baseUrl={props.match.url} data={data.shards} />
        <div>
          <TitleSeparator title="Tags" />
          {data.tags.length > 0 ? (
            <TagCloudSelector
              className="rlm-tag-cloud"
              tagClass="rlm-tag"
              name="tags"
              tagOptions={data.tags.map((x) => ({ id: x.code, name: x.name }))}
              onSelect={(selected) =>
                props.history.push(`/by-tag?tag=${selected}`)
              }
            />
          ) : (
            <p className="user-message">
              {data.name} currently has no tags. Consider setting some to
              improve searchability!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RealmViewPage;
