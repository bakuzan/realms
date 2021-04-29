import { Tag } from './Tag';

export interface Realm {
  id: number;
  name: string;
  code: string;
  isAuthenticationRestricted: boolean;
  isPrivate: boolean;
  realmOwnerUserId: string;
}

export interface RealmItem {
  id: number;
  name: string;
  code: string;
  fragmentCount: number;
}

export interface RealmView extends Realm {
  tags: Tag[];
}
