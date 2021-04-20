export interface Realm {
  id: number;
  name: string;
  code: string;
  isAuthenticationRestricted: boolean;
  isPrivate: boolean;
  realmOwnerUserId: string;
}
