import { useEffect, useState } from 'react';
import { Profile } from 'oidc-client';

import authService from 'src/components/ApiAuthorization/AuthorizeService';

interface GuardWithAuthorisationProps {
  ownerUserId?: string;
  children: JSX.Element;
}

function GuardWithAuthorisation(props: GuardWithAuthorisationProps) {
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    async function refreshUser() {
      const user = await authService.getUser();
      setUser(user);
    }

    const unsubId = authService.subscribe(() => refreshUser());
    refreshUser();

    return () => authService.unsubscribe(unsubId);
  }, []);
  console.log('GwA', props, user);
  if (!user || (props.ownerUserId && user.userId !== props.ownerUserId)) {
    return null;
  }

  return props.children;
}

export default GuardWithAuthorisation;
