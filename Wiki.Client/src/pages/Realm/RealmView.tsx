import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

import { Button } from 'meiko/Button';
import ClearableInput from 'meiko/ClearableInput';
import TagCloudSelector from 'meiko/TagCloudSelector';
import { useAsync } from 'meiko/hooks/useAsync';

import GuardWithAuthorisation from 'src/components/GuardWithAuthorisation';
import TitleSeparator from 'src/components/TitleSeparator';
import RealmsLink from 'src/components/RealmsLink';
import RealmGroups from 'src/components/RealmGroups';

import sendRequest from 'src/utils/sendRequest';

import { RealmView } from 'src/interfaces/Realm';
import { PageProps } from 'src/interfaces/PageProps';
import { TagOptionWithCount } from 'src/interfaces/Tag';

import './RealmView.scss';

interface RealmViewProps extends PageProps<{ realmCode: string }> {
  data: RealmView;
}

function RealmViewPage(props: RealmViewProps) {
  const [filter, setFilter] = useState('');

  const { data } = props;
  const realmName = data.name;
  const realmCode = data.code;

  const tagState = useAsync(
    async () =>
      sendRequest<TagOptionWithCount[]>(
        `tag/getfragmenttagsinrealmcounted/${realmCode}`
      ),
    [realmCode]
  );

  const fragmentTags = tagState.value?.data ?? [];

  return (
    <div className="page">
      <Helmet title={`Hub`} />
      <header className="page__header">
        <h2 className="page__title">{realmName} Hub</h2>

        <div className="button-group">
          <GuardWithAuthorisation
            isPrivate={data.isPrivate}
            ownerUserId={data.realmOwnerUserId}
          >
            <RealmsLink to={`${props.match.url}/edit`}>Edit</RealmsLink>
          </GuardWithAuthorisation>
          <Button
            className="rlm-false-link"
            onClick={() => props.history.goBack()}
          >
            Back
          </Button>
        </div>
      </header>
      <div className="page__action-bar">
        <ClearableInput
          id="filter"
          name="filter"
          value={filter}
          label="Filter fragments"
          placeholder="Enter text to filter on fragments on name, content, or tags"
          aria-label="Enter text to filter on fragments on name, content, or tags"
          onKeyPress={(e) => e.stopPropagation()}
          onChange={(e) => setFilter(e.currentTarget?.value ?? '')}
        />
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
        <RealmGroups realmCode={realmCode} filter={filter} data={data.shards} />
        <div className="realm-tags">
          <div className="realm-tags__block">
            <TitleSeparator title="Fragment Tags" />
            {fragmentTags.length > 0 ? (
              <TagCloudSelector
                className="rlm-tag-cloud"
                tagClass="rlm-tag"
                name="tags"
                sizeRelativeToCount
                sizes={{ min: 0.75, max: 2.5 }}
                tagOptions={fragmentTags.map((x) => ({
                  id: x.code,
                  name: x.name,
                  count: x.count
                }))}
                onSelect={(selected) =>
                  props.history.push(`/by-tag/${data.code}?tag=${selected}`)
                }
              />
            ) : (
              <p className="user-message">
                Fragments currently has no tags. Consider setting some to
                improve searchability!
              </p>
            )}
          </div>

          <div className="realm-tags__block">
            <TitleSeparator title="Tags" />
            {data.tags.length > 0 ? (
              <TagCloudSelector
                className="rlm-tag-cloud"
                tagClass="rlm-tag"
                name="tags"
                tagOptions={data.tags.map((x) => ({
                  id: x.code,
                  name: x.name
                }))}
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
    </div>
  );
}

export default RealmViewPage;
