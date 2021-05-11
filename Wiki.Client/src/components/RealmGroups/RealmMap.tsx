import classNames from 'classnames';
import React, { useState } from 'react';

import Grid from 'meiko/Grid';

import RealmsLink from 'src/components/RealmsLink';

import { RealmShard, RealmShardEntry } from 'src/interfaces/RealmShard';

const noGroupsText = 'This realm currently has no pages.';
const noItemsText = 'Group contains no fragments.';

interface RealmMapProps {
  baseUrl: string;
  data: RealmShard[];
}

interface MapItemProps {
  baseUrl: string;
  data: RealmShard;
}

function MapItem({ baseUrl, data }: MapItemProps) {
  const [highlightIndex, setHighlightIndex] = useState(-1);

  return (
    <li className="realm-group">
      {data.name && <h4 className="realm-group__title">{data.name}</h4>}
      <Grid
        className={classNames(
          'realm-group__entries',
          'realm-group__entries--grouped'
        )}
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
                className="realm-fragment"
                to={`${baseUrl}/${item.fragmentCode}`}
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

function RealmMap(props: RealmMapProps) {
  const groups = props.data.filter((x) => x.id !== 0);
  const remainder = props.data.find((x) => x.id === 0);

  return (
    <div className="realm-map">
      <h3 className="realm-map__title">Fragments</h3>
      <Grid
        className="realm-map__items"
        items={groups}
        noItemsText={noGroupsText}
      >
        {(group: RealmShard) => (
          <MapItem key={group.id} baseUrl={props.baseUrl} data={group} />
        )}
      </Grid>
      {remainder !== undefined && (
        <Grid
          className={classNames('realm-fragments')}
          items={remainder.entries}
          noItemsText={noItemsText}
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
                  className="realm-fragment"
                  to={`${props.baseUrl}/${item.fragmentCode}`}
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
}

export default RealmMap;
