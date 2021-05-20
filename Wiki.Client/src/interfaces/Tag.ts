import { TagScope } from 'src/constants';

export interface Tag {
  id: number;
  code: string;
  name: string;
  tagScope: TagScope;
}

export interface TagInput {
  id: string;
  name: string;
}

export interface TagOption {
  id: number;
  code: string;
  name: string;
}

export interface TagRelatedItem {
  id: number;
  code: string;
  name: string;
  fragmentCount?: number;
  realmCode?: string;
  tagScope: TagScope;
}

export interface WithTagsResponse {
  realmName?: string;
  tags: Tag[];
  items: TagRelatedItem[];
}
