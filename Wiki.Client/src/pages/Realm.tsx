import React from 'react';
import { Helmet } from 'react-helmet';

import LoadingBouncer from 'meiko/LoadingBouncer';

import RequestMessage from 'src/components/RequestMessage';

import { useAsync } from 'src/hooks/useAsync';
import sendRequest from 'src/utils/sendRequest';

import { Realm } from 'src/interfaces/Realm';
import { PageProps } from 'src/interfaces/PageProps';

function RealmPage(props: PageProps<{ realmCode: string }>) {
  const realmCode = props.match.params.realmCode;
  const state = useAsync(
    async () => await sendRequest<Realm>(`realm/${realmCode}`),
    [realmCode]
  );

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

  console.log('Realm Page > ', props, state);

  const response = state.value.data;
  const realmName = response.name;

  return (
    <div>
      <Helmet title={`${realmName} Hub`} />
      <h2>{realmName} Hub</h2>
    </div>
  );
}

export default RealmPage;
