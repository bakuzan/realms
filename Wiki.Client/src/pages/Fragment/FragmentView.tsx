import React from 'react';
import { Helmet } from 'react-helmet';

import { Button } from 'meiko/Button';
import TagCloudSelector from 'meiko/TagCloudSelector';
import { useAsync } from 'meiko/hooks/useAsync';

import Markdown from 'src/components/Markdown';
import GuardResponseState from 'src/components/GuardResponseState';
import GuardWithAuthorisation from 'src/components/GuardWithAuthorisation';
import RelatedFragments from 'src/components/RelatedFragments';
import TitleSeparator from 'src/components/TitleSeparator';
import RealmsLink from 'src/components/RealmsLink';

import sendRequest from 'src/utils/sendRequest';

import { FragmentDetailView } from 'src/interfaces/Fragment';
import { RealmView } from 'src/interfaces/Realm';
import { PageProps } from 'src/interfaces/PageProps';

interface FragmentViewProps
  extends PageProps<{ realmCode: string; fragmentCode: string }> {
  data: RealmView;
}

function FragmentViewPage(props: FragmentViewProps) {
  const { data: realm } = props;

  const { fragmentCode } = props.match.params;
  const state = useAsync(
    async () =>
      sendRequest<FragmentDetailView>(`fragment/${fragmentCode}/detail`),
    [fragmentCode]
  );

  return (
    <GuardResponseState state={state}>
      {(fragment) => {
        const fragmentName = fragment.name;

        return (
          <div className="page">
            <Helmet title={fragmentName} />
            <header className="page__header">
              <div>
                <h2 className="page__title">{fragmentName}</h2>
                <p className="page__subtitle">
                  of{' '}
                  <RealmsLink exact to={`/${realm.code}`}>
                    {realm.name}
                  </RealmsLink>{' '}
                  realm
                </p>
              </div>
              <div className="button-group">
                <GuardWithAuthorisation
                  isPrivate={realm.isPrivate}
                  ownerUserId={realm.realmOwnerUserId}
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
            <div className="page-grid">
              <div className="page-grid__core">
                <Markdown data={fragment.content} />
                <div>
                  <TitleSeparator title="Tags" />
                  {fragment.tags.length > 0 ? (
                    <TagCloudSelector
                      className="rlm-tag-cloud"
                      tagClass="rlm-tag"
                      name="tags"
                      tagOptions={fragment.tags.map((x) => ({
                        id: x.code,
                        name: x.name
                      }))}
                      onSelect={(selected) =>
                        props.history.push(
                          `/by-tag/${realm.code}?tag=${selected}`
                        )
                      }
                    />
                  ) : (
                    <p className="user-message">
                      {fragment.name} currently has no tags. Consider setting
                      some to improve searchability!
                    </p>
                  )}
                </div>
              </div>
              <div className="page-grid__sidebar">
                <RelatedFragments data={fragment.relatedFragments} />
              </div>
            </div>
          </div>
        );
      }}
    </GuardResponseState>
  );
}

export default FragmentViewPage;
