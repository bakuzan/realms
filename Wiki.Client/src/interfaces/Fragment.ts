import { Tag } from './Tag';

export interface Fragment {
  id: number;
  name: string;
  code: string;
  content: string;
}

export interface FragmentView extends Fragment {
  tags: Tag[];
}
