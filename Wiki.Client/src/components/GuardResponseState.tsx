import React, { useEffect, useState } from 'react';

import LoadingBouncer from 'meiko/LoadingBouncer';
import { AsyncState } from 'meiko/hooks/useAsyncFn';

import RequestMessage from 'src/components/RequestMessage';

import { ApiResponse } from 'src/utils/sendRequest';

interface GuardResponseStateProps<T> {
  loadingDelay?: number;
  state: AsyncState<ApiResponse<T>>;
  children: (state: T) => JSX.Element;
}

function GuardResponseState<T>(props: GuardResponseStateProps<T>) {
  const { loadingDelay, state } = props;
  const loading = state.loading;
  const [isLoading, setIsLoading] = useState(!loadingDelay);

  useEffect(() => {
    if (loading && loadingDelay) {
      setTimeout(() => setIsLoading(true), loadingDelay);
    } else if (!loading && loadingDelay) {
      setIsLoading(false);
    }
  }, [loading, loadingDelay, isLoading]);

  if (loading && isLoading) {
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
