import classNames from 'classnames';
import React from 'react';

import { Helmet } from 'react-helmet';

import constructObjectFromSearchParams from 'ayaka/constructObjectFromSearchParams';
import { Button } from 'meiko/Button';
import Grid from 'meiko/Grid';
import { useAsync } from 'meiko/hooks/useAsync';

import GuardResponseState from 'src/components/GuardResponseState';
import RealmsLink from 'src/components/RealmsLink';

import sendRequest from 'src/utils/sendRequest';
import listify from 'src/utils/listify';

import { TagRelatedItem, WithTagsResponse } from 'src/interfaces/Tag';
import { PageProps } from 'src/interfaces/PageProps';

import './Tag.scss';

interface TagPageProps extends PageProps<{ realmCode?: string }> {}

function TagPage(props: TagPageProps) {
  const { realmCode } = props.match.params;

  const searchParams = constructObjectFromSearchParams(props.location.search);
  const tagCode = searchParams['tag'];
  const tagPageTitle = realmCode ? `Fragments for Tags` : 'Realms for Tags';

  const state = useAsync(
    async () =>
      await sendRequest<WithTagsResponse>(
        realmCode ? 'tag/GetFragmentsWithTags' : 'tag/GetRealmsWithTags',
        {
          method: 'POST',
          body: JSON.stringify({ realmCode, tagCodes: [tagCode] })
        }
      ),
    [realmCode, tagCode]
  );

  console.log('PROPS', realmCode, searchParams, props);
  return (
    <GuardResponseState state={state}>
      {(response) => {
        const noItemsText = 'No items found for tag(s).';
        const tagName = listify(response.tags.map((x) => x.name));
        const items = response.items;
        const isEmpty = items.length === 0;
        const tagPageSubtitle = realmCode
          ? `Showing fragments in ${response.realmName} for ${tagName}`
          : `Showing realms for ${tagName}`;

        return (
          <div className="by-tag">
            <Helmet title={tagPageTitle} />
            <header className="by-tag__header">
              <div>
                <h2>{tagPageTitle}</h2>
                <p className="by-tag__subtitle">{tagPageSubtitle}</p>
              </div>
              <div>
                <Button
                  btnStyle="accent"
                  onClick={() => props.history.goBack()}
                >
                  Back
                </Button>
              </div>
            </header>
            <Grid
              className={classNames('tag-related-items', {
                'tag-related-items--empty': isEmpty
              })}
              items={items}
              noItemsText={noItemsText}
            >
              {(x: TagRelatedItem) => {
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
                    {typeof x.fragmentCount === 'number' && (
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
          </div>
        );
      }}
    </GuardResponseState>
  );
}

export default TagPage;
