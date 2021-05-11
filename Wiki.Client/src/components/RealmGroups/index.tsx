import React from 'react';

import RealmMap from './RealmMap';

import { RealmShard } from 'src/interfaces/RealmShard';

import './RealmGroups.scss';

interface RealmGroupsProps {
  baseUrl: string;
  data: RealmShard[];
  onChange?: (data: RealmShard[]) => void;
}

function RealmGroupsEditor(props: RealmGroupsProps) {
  return <div className="realm-groups-editor"></div>;
}

export default function RealmGroups(props: RealmGroupsProps) {
  const View = props.onChange ? RealmGroupsEditor : RealmMap;
  console.log(' RealmGroups >> ', props, props.data);

  return <View {...props} />;
}
