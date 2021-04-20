import classNames from 'classnames';
import React, { useState } from 'react';

import ClearableInput from 'meiko/ClearableInput';
import Grid, { GridProps } from 'meiko/Grid';
import LoadingBouncer from 'meiko/LoadingBouncer';

import RequestMessage from 'src/components/RequestMessage';

import { AsyncState } from 'src/hooks/useAsyncFn';
import { ApiResponse } from 'src/utils/sendRequest';

interface ResponseGridProps<T> extends Pick<GridProps<T>, 'children'> {
  data: AsyncState<ApiResponse<T[]>>;
  filterFn: (filter: string) => (x: T, i: number, arr: T[]) => boolean;
}

function ResponseGrid<T>(props: ResponseGridProps<T>) {
  const [filter, setFilter] = useState('');
  const enableFilter = !!props.filterFn;
  const state = props.data;

  console.log('RG > ', state);

  if (state.loading) {
    return <LoadingBouncer />;
  }

  if (state.error) {
    return (
      <RequestMessage
        text="Failed to send request"
        error={state.error.message}
      />
    );
  } else if (state.value && !state.value.success) {
    return (
      <RequestMessage
        text="Failed to send request"
        error={state.value.errorMessages[0]}
      />
    );
  } else if (!state.value) {
    return null;
  }

  const hasFilter = !!filter;
  const filterLower = filter.toLowerCase();
  const noItemsText = !hasFilter
    ? 'No items'
    : 'No items found for current filter';

  const response = state.value;
  const filteredItems = enableFilter
    ? response.data.filter(props.filterFn(filterLower))
    : response.data;

  console.log('RG > ', response, filteredItems);

  return (
    <div>
      {enableFilter && (
        <div>
          <ClearableInput
            id="filter"
            name="filter"
            value={filter}
            label="Filter realms"
            aria-label="Enter text to filter on realms on name or code"
            onKeyPress={(e) => e.stopPropagation()}
            onChange={(e) => {
              const el = e.target as HTMLInputElement;
              setFilter(el.value);
            }}
          />
        </div>
      )}

      <Grid
        className={classNames('realms', {
          'realms--empty': filteredItems.length === 0
        })}
        items={filteredItems}
        noItemsText={noItemsText}
      >
        {props.children}
      </Grid>
    </div>
  );
}

export default ResponseGrid;
