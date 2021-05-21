import React from 'react';

import TitleSeparator from 'src/components/TitleSeparator';
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
  return props.onChange ? (
    <React.Fragment>
      <TitleSeparator title="Fragment Map" />
      <RealmMapEditor {...props} onChange={props.onChange} />
    </React.Fragment>
  ) : (
    <RealmMap {...props} />
  );
}
