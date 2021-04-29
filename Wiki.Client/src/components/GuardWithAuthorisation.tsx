import { useEffect, useState } from 'react';
import { Profile } from 'oidc-client';

import authService from 'src/components/ApiAuthorization/AuthorizeService';

type GuardWithAuthorisationProps =
  | {
      isPrivate: true;
      ownerUserId: string;
      children: JSX.Element;
    }
  | {
      isPrivate?: false;
      children: JSX.Element;
    };

function GuardWithAuthorisation(props: GuardWithAuthorisationProps) {
  const [user, setUser] = useState<Profile | null>(null);
  const ownerUserId = props.isPrivate ? props.ownerUserId : null;

  useEffect(() => {
    async function refreshUser() {
      const user = await authService.getUser();
      setUser(user);
    }

    const unsubId = authService.subscribe(() => refreshUser());
    refreshUser();

    return () => authService.unsubscribe(unsubId);
  }, []);

  if (!user || (ownerUserId && user.sub !== ownerUserId)) {
    return null;
  }

  return props.children;
}

export default GuardWithAuthorisation;
