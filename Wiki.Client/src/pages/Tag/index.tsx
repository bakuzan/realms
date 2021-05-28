import classNames from 'classnames';
import React from 'react';

import { Helmet } from 'react-helmet';

import constructObjectFromSearchParams from 'ayaka/constructObjectFromSearchParams';
import { Button } from 'meiko/Button';
import Grid from 'meiko/Grid';
import TagCloudSelector from 'meiko/TagCloudSelector';
import { useAsync } from 'meiko/hooks/useAsync';

import GuardResponseState from 'src/components/GuardResponseState';
import RealmsLink from 'src/components/RealmsLink';
import TitleSeparator from 'src/components/TitleSeparator';

import sendRequest from 'src/utils/sendRequest';
import listify from 'src/utils/listify';

import { TagRelatedItem, WithTagsResponse } from 'src/interfaces/Tag';
import { PageProps } from 'src/interfaces/PageProps';

import './Tag.scss';

interface TagPageProps extends PageProps<{ realmCode?: string }> {}

function TagPage(props: TagPageProps) {
  const { realmCode } = props.match.params;
  const isFragments = !!realmCode;

  const searchParams = constructObjectFromSearchParams(props.location.search);
  const tagCode = searchParams['tag'] || '';
  const selectedCodes = tagCode.split('+');
  const tagPageTitle = isFragments ? `Fragments for Tags` : 'Realms for Tags';

  const state = useAsync(
    async () =>
      await sendRequest<WithTagsResponse>(
        realmCode ? 'tag/GetFragmentsWithTags' : 'tag/GetRealmsWithTags',
        {
          method: 'POST',
          body: JSON.stringify({ realmCode, tagCodes: tagCode.split('+') })
        }
      ),
    [realmCode, tagCode]
  );

  return (
    <GuardResponseState
      loadingDelay={state.value ? 500 : undefined}
      state={state}
    >
      {(response) => {
        const noItemsText = 'No items found for tag(s).';
        const tagName = listify(response.tags.map((x) => x.name));

        const items = response.items;
        const isEmpty = items.length === 0;

        const tagOptions = response.tagOptions;
        const hasTags = tagOptions.length > 0;

        return (
          <div className="page">
            <Helmet title={tagPageTitle} />
            <header className="page__header">
              <div>
                <h2 className="page__title">{tagPageTitle}</h2>
                <p className="page__subtitle">
                  Showing {items.length}{' '}
                  {isFragments ? (
                    <React.Fragment>
                      fragments in{' '}
                      <RealmsLink exact to={`/${realmCode}`}>
                        {response.realmName}
                      </RealmsLink>
                    </React.Fragment>
                  ) : (
                    'realms'
                  )}{' '}
                  for {tagName}
                </p>
              </div>
              <div className="button-group">
                <Button
                  className="rlm-false-link"
                  onClick={() => props.history.goBack()}
                >
                  Back
                </Button>
              </div>
            </header>

            <Grid
              className={classNames('tag-related-items', {
                'tag-related-items--empty': isEmpty,
                'tag-related-items--realm': !isFragments,
                'tag-related-items--fragment': isFragments
              })}
              items={items}
              noItemsText={noItemsText}
            >
              {(x: TagRelatedItem) => {
                const hasCount = typeof x.fragmentCount === 'number';
                const fragmentText = x.fragmentCount === 1 ? 'page' : 'pages';
                const itemLink = x.realmCode
                  ? `/${x.realmCode}/${x.code}`
                  : `/${x.code}`;

                return (
                  <li key={x.id} className="tag-related-items__item">
                    <RealmsLink
                      className="tag-related-items__link"
                      to={itemLink}
                    >
                      {x.name}
                    </RealmsLink>
                    {hasCount && (
                      <div>
                        {x.fragmentCount
                          ? `${x.fragmentCount} ${fragmentText}`
                          : `No pages`}
                      </div>
                    )}
                  </li>
                );
              }}
            </Grid>

            <TitleSeparator title="Tags" />
            {hasTags && (
              <TagCloudSelector
                className="rlm-tag-cloud"
                tagClass="rlm-tag"
                name="tags"
                selectedTags={selectedCodes}
                tagOptions={tagOptions.map((x) => ({
                  id: x.code,
                  name: x.name
                }))}
                onSelect={(selected) => {
                  const updatedSelection = selected.join('+');

                  props.history.push(
                    `${props.location.pathname}?tag=${updatedSelection}`
                  );
                }}
              />
            )}
          </div>
        );
      }}
    </GuardResponseState>
  );
}

export default TagPage;
