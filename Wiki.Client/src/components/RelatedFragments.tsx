import classNames from 'classnames';
import React from 'react';

import groupBy from 'ayaka/groupBy';
import orderBy from 'ayaka/orderBy';
import Grid from 'meiko/Grid';

import RealmsLink from './RealmsLink';

import { FragmentRelation } from 'src/constants';
import { RelatedFragment } from 'src/interfaces/Fragment';

import './RelatedFragments.scss';

interface RelatedFragmentsProps {
  data: RelatedFragment[];
}

function RelatedFragments(props: RelatedFragmentsProps) {
  if (props.data.length === 0) {
    return null;
  }

  const prevNext = props.data.filter(
    (x) => x.fragmentRelation !== FragmentRelation.Related
  );

  const prevAndNextGroups = groupBy(prevNext, (x) => x.shardCode);

  return (
    <section className="related-fragments">
      <header>
        <h3 className="related-fragments__title">Related</h3>
      </header>
      <Grid
        className="related-fragments__groups"
        items={Array.from(prevAndNextGroups.entries())}
      >
        {([shardCode, group]: [string, RelatedFragment[]]) => {
          const shardName = group[0].shardName;

          return (
            <li key={shardCode} className="related-fragments__group">
              <h4 className="related-fragments__shard-name">{shardName}</h4>
              <div className="prev-next-block">
                {orderBy(group, ['fragmentRelation'], ['ASC']).map(
                  (x: RelatedFragment) => {
                    const isNext = x.fragmentRelation === FragmentRelation.Next;
                    const isPrev =
                      x.fragmentRelation === FragmentRelation.Previous;

                    const titleText = isNext
                      ? `Go to the next fragment, ${x.name}`
                      : `Go to the previous fragment, ${x.name}`;

                    return (
                      <RealmsLink
                        className={classNames('realm-fragment', {
                          'realm-fragment--prev': isPrev,
                          'realm-fragment--next': isNext
                        })}
                        to={`/${x.realmCode}/${x.code}`}
                        title={titleText}
                        aria-label={titleText}
                      >
                        <span
                          className="prev-next-block__name"
                          aria-hidden={true}
                        >
                          {x.name}
                        </span>
                      </RealmsLink>
                    );
                  }
                )}
              </div>
            </li>
          );
        }}
      </Grid>
    </section>
  );
}

export default RelatedFragments;
