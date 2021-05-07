import React from 'react';

import { RealmShard } from 'src/interfaces/RealmShard';

interface RealmGroupsProps {
  data: RealmShard[];
  onChange?: (data: RealmShard[]) => void;
}

function RealmGroupLinkMap(props: RealmGroupsProps) {
  return <div className="realm-map"></div>;
}

export default function RealmGroups(props: RealmGroupsProps) {
  const isEditor = !!props.onChange;
  const View = isEditor ? () => null : RealmGroupLinkMap;
  console.log(isEditor, ' RealmGroups >> ', props, props.data);

  return <View {...props} />;
}
