import React from 'react';
import { Helmet } from 'react-helmet';

import TagCloudSelector from 'meiko/TagCloudSelector';

import Markdown from 'src/components/Markdown';
import GuardResponseState from 'src/components/GuardResponseState';
import GuardWithAuthorisation from 'src/components/GuardWithAuthorisation';
import TitleSeparator from 'src/components/TitleSeparator';
import RealmsLink from 'src/components/RealmsLink';

import { useAsync } from 'src/hooks/useAsync';
import sendRequest from 'src/utils/sendRequest';

import { FragmentView } from 'src/interfaces/Fragment';
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
    async () => sendRequest<FragmentView>(`fragment/${fragmentCode}`),
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
                      id: x.id ?? 0,
                      name: x.name
                    }))}
                    onSelect={() =>
                      console.log(
                        '%c TODO > Make this go to a page of fragments with this tag...',
                        'color:red; font-size:18px;'
                      )
                    }
                  />
                </div>
              </div>
              <div className="page-grid__sidebar">
                here we need related pages/links
                <br />
                this will be based on the realm groupings and tags
                <br />
              </div>
            </div>
          </div>
        );
      }}
    </GuardResponseState>
  );
}

export default FragmentViewPage;
