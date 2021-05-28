import React from 'react';

import TitleSeparator from 'src/components/TitleSeparator';
import RealmMap, { RealmMapProps } from './RealmMap';
import RealmMapEditor, { RealmMapEditorProps } from './RealmMapEditor';

import './RealmGroups.scss';

type RealmGroupsProps = RealmMapProps | RealmMapEditorProps;

export default function RealmGroups(props: RealmGroupsProps) {
  return 'onChange' in props ? (
    <React.Fragment>
      <TitleSeparator title="Fragment Map" />
      <RealmMapEditor {...props} onChange={props.onChange} />
    </React.Fragment>
  ) : (
    <RealmMap {...props} />
  );
}
