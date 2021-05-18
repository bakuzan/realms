import { FragmentRelation } from 'src/constants';
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

export interface RelatedFragment {
  id: number;
  name: string;
  code: string;
  fragmentRelation: FragmentRelation;
  realmCode: string;
  shardCode: string;
  shardName: string;
}

export interface FragmentDetailView extends FragmentView {
  relatedFragments: RelatedFragment[];
}
