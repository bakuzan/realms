import { TagScope } from 'src/constants';

export interface Tag {
  id: number;
  code: string;
  name: string;
  tagScope: TagScope;
}

export interface TagInput {
  id?: string;
  code: string;
  name: string;
}
