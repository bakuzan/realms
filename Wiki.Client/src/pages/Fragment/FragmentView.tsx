import React from 'react';
import { Helmet } from 'react-helmet';

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

  console.log('FragmentView >> ', props);
  return (
    <GuardResponseState state={state}>
      {(fragment) => {
        console.log('Fragment > ', props, state);
        const fragmentName = fragment.name;

        return (
          <div className="page">
            <Helmet title={fragmentName} />
            <header className="page__header">
              <h2>{fragmentName}</h2>
              <GuardWithAuthorisation
                isPrivate={realm.isPrivate}
                ownerUserId={realm.realmOwnerUserId}
              >
                <RealmsLink to={`${props.match.url}/edit`}>Edit</RealmsLink>
              </GuardWithAuthorisation>
            </header>
            <div className="page-grid">
              <div className="page-grid__core">
                <Markdown data={fragment.content} />
                <div>
                  <TitleSeparator title="Tags" />
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
