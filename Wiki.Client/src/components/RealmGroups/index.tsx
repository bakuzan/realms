import React from 'react';

import RealmMap from './RealmMap';
import RealmMapEditor from './RealmMapEditor';

import { RealmShard } from 'src/interfaces/RealmShard';

import './RealmGroups.scss';

interface RealmGroupsProps {
  baseUrl: string;
  data: RealmShard[];
  onChange?: (data: RealmShard[]) => void;
}

export default function RealmGroups(props: RealmGroupsProps) {
  console.log(' RealmGroups >> ', props, props.data);

  if (props.onChange) {
    return <RealmMapEditor {...props} onChange={props.onChange} />;
  }

  return <RealmMap {...props} />;
}
