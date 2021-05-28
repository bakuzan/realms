import classNames from 'classnames';
import React, { useState } from 'react';

import Grid from 'meiko/Grid';
import { useAsync } from 'meiko/hooks/useAsync';
import { useDebounce } from 'meiko/hooks/useDebounce';

import GuardResponseState from 'src/components/GuardResponseState';
import RealmsLink from 'src/components/RealmsLink';

import sendRequest from 'src/utils/sendRequest';

import { RealmShard, RealmShardEntry } from 'src/interfaces/RealmShard';
import { FragmentMatch } from 'src/interfaces/Fragment';

const noFragmentsText = `This realm is devoid of fragments...
When you add new fragments, they will appear here.`;

const noItemsText = 'Group contains no fragments.';

interface MapItemProps {
  data: RealmShard;
}

function MapItem({ data }: MapItemProps) {
  const [highlightIndex, setHighlightIndex] = useState(-1);

  return (
    <li className="realm-group">
      {data.name && <h4 className="realm-group__title">{data.name}</h4>}
      <Grid
        className={classNames(
          'realm-group__entries',
          'realm-group__entries--grouped',
          { 'realm-group__entries--ordered': data.isOrdered }
        )}
        element={data.isOrdered ? 'ol' : undefined}
        items={data.entries}
        noItemsText={noItemsText}
      >
        {(item: RealmShardEntry, i: number) => {
          const highlightExact = highlightIndex === i;
          const highlight = highlightIndex >= i;

          return (
            <li
              key={item.fragmentId}
              className={classNames('realm-group__item', {
                'realm-group__item--highlight': highlight,
                'realm-group__item--highlight-exact': highlightExact
              })}
              onMouseEnter={() => setHighlightIndex(i)}
              onMouseLeave={() => setHighlightIndex(-1)}
            >
              <RealmsLink
                className="realm-fragment realm-fragment--go"
                to={`/${item.realmCode}/${item.fragmentCode}`}
              >
                {item.fragmentName}
              </RealmsLink>
            </li>
          );
        }}
      </Grid>
    </li>
  );
}

export interface RealmMapProps {
  data: RealmShard[];
  filter: string;
  realmCode: string;
}

function RealmMap(props: RealmMapProps) {
  const { realmCode, filter } = props;
  const debouncedFilter = useDebounce(filter, 600);

  const state = useAsync(
    async () =>
      await sendRequest<FragmentMatch[]>(`/fragment/searchrealmfragments`, {
        method: 'POST',
        body: JSON.stringify({ realmCode, filter: debouncedFilter ?? '' })
      }),
    [realmCode, debouncedFilter]
  );

  const groups = props.data.filter((x) => x.id !== 0);
  const remainder = props.data.find((x) => x.id === 0);

  const hasNoFragments =
    groups.length === 0 &&
    (remainder === undefined || remainder.entries.length === 0);

  return (
    <GuardResponseState loadingDelay={500} state={state}>
      {(response) => {
        const matched = new Set(response.map((x) => x.id));
        const filteredGroups = groups
          .map((g) => ({
            ...g,
            entries: g.entries.filter((e) => matched.has(e.fragmentId))
          }))
          .filter((g) => g.entries.length > 0);

        return (
          <div className="realm-map">
            <h3 className="realm-map__title">Fragments</h3>
            {hasNoFragments && (
              <p className="realm-map__no-items">{noFragmentsText}</p>
            )}
            <Grid
              className="realm-map__items"
              items={filteredGroups}
              noItemsText={false}
            >
              {(group: RealmShard) => <MapItem key={group.id} data={group} />}
            </Grid>
            {remainder !== undefined && (
              <Grid
                className={classNames('realm-remainder-fragments')}
                items={remainder.entries.filter((e) =>
                  matched.has(e.fragmentId)
                )}
                noItemsText={false}
              >
                {(item: RealmShardEntry) => {
                  return (
                    <li
                      key={item.fragmentId}
                      className={classNames(
                        'realm-group__item',
                        'realm-group__item--remainder'
                      )}
                    >
                      <RealmsLink
                        className="realm-fragment realm-fragment--go"
                        to={`/${item.realmCode}/${item.fragmentCode}`}
                      >
                        {item.fragmentName}
                      </RealmsLink>
                    </li>
                  );
                }}
              </Grid>
            )}
          </div>
        );
      }}
    </GuardResponseState>
  );
}

export default RealmMap;
