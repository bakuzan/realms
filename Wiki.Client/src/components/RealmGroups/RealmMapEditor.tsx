import React, { useState } from 'react';

import filterFalsey from 'ayaka/helpers/filterFalsey';
import generateUniqueId from 'ayaka/generateUniqueId';
import { EventCodes } from 'meiko/constants/enums';
import Grid from 'meiko/Grid';
import ClearableInput from 'meiko/ClearableInput';
import { Button } from 'meiko/Button';

import GroupEditor, { FragmentContext } from './GroupEditor';

import { RealmShard, RealmShardEntry } from 'src/interfaces/RealmShard';

interface RealmMapEditorProps {
  baseUrl: string;
  data: RealmShard[];
  onChange: (data: RealmShard[]) => void;
}

export default function RealmMapEditor(props: RealmMapEditorProps) {
  const [newName, setNewName] = useState('');
  const disableAddGroup = !newName;

  const fragmentGroups = props.data.slice(0);
  const filteredFragmentGroups = fragmentGroups.filter((x) =>
    filterFalsey(x.code)
  );
  const [allFragments] = useState(() =>
    props.data
      .reduce((p, c) => [...p, ...c.entries], [] as RealmShardEntry[])
      .map((x) => ({ ...x, id: 0, entryOrder: undefined }))
  );

  function onAddNewGroup() {
    const name = newName;
    props.onChange([
      ...fragmentGroups,
      {
        id: 0,
        name,
        code: generateUniqueId(),
        isOrdered: false,
        entries: []
      }
    ]);

    setNewName('');
  }

  return (
    <FragmentContext.Provider value={allFragments}>
      <div className="realm-groups-editor">
        <Grid
          className="groups-editor"
          items={filteredFragmentGroups}
          noItemsText={false}
        >
          {(item: RealmShard) => {
            return (
              <GroupEditor
                key={item.code}
                data={item}
                onUpdate={(x) => {
                  const shards = fragmentGroups.map((f) =>
                    f.code === x.code ? x : f
                  );

                  props.onChange(shards);
                }}
                onRemove={(code) => {
                  const shards = fragmentGroups.filter(
                    (f) => !f.code || f.code !== code
                  );

                  props.onChange(shards);
                }}
              />
            );
          }}
        </Grid>
        <div className="realm-groups-editor__controls">
          <ClearableInput
            id="addRealmGrouping"
            name="newGroupName"
            label="New Group Name"
            placeholder="What would you like to call the new group?"
            value={newName}
            onChange={(e) => setNewName(e.currentTarget?.value ?? '')}
            onKeyDown={(event) => {
              if (event.code === EventCodes.Enter) {
                event.preventDefault();
                event.stopPropagation();

                if (!disableAddGroup) {
                  onAddNewGroup();
                }
              }
            }}
          />

          <Button
            className="realm-groups-editor__add"
            btnStyle="primary"
            disabled={disableAddGroup}
            onClick={onAddNewGroup}
          >
            Add {newName || 'New'} Group
          </Button>
        </div>
      </div>
    </FragmentContext.Provider>
  );
}
