import React from 'react';

import LoadingBouncer from 'meiko/LoadingBouncer';
import RequestMessage from 'src/components/RequestMessage';

import { AsyncState } from 'src/hooks/useAsyncFn';
import { ApiResponse } from 'src/utils/sendRequest';

interface GuardResponseStateProps<T> {
  state: AsyncState<ApiResponse<T>>;
  children: (state: T) => JSX.Element;
}

function GuardResponseState<T>(props: GuardResponseStateProps<T>) {
  const state = props.state;

  if (state.loading) {
    return <LoadingBouncer />;
  }

  if (state.error) {
    return <RequestMessage text="Failed to send request" error={state.error} />;
  } else if (state.value && !state.value.success) {
    return (
      <RequestMessage text="Something went wrong!">
        {state.value.errorMessages.map((x) => (
          <div key={x}>{x}</div>
        ))}
      </RequestMessage>
    );
  } else if (!state.value) {
    return null;
  }

  return props.children(state.value.data);
}

export default GuardResponseState;
