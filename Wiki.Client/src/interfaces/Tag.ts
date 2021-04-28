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
  name: string;
}
