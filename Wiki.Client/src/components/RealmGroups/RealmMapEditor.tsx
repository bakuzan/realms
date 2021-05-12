import React, { useState } from 'react';

import slugify from 'ayaka/slugify';
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
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const fragmentGroups = props.data.filter((x) => x.code !== '');
  const allFragments = props.data.reduce(
    (p, c) => [...p, ...c.entries],
    [] as RealmShardEntry[]
  );

  return (
    <FragmentContext.Provider value={allFragments}>
      <div className="realm-groups-editor">
        <Grid
          className="groups-editor"
          items={fragmentGroups}
          noItemsText={false}
        >
          {(item: RealmShard) => {
            return (
              <GroupEditor
                key={item.code}
                data={item}
                onUpdate={(x) =>
                  props.onChange(
                    fragmentGroups.map((f) => (f.code === x.code ? x : f))
                  )
                }
                onRemove={(code) =>
                  props.onChange(fragmentGroups.filter((f) => f.code !== code))
                }
              />
            );
          }}
        </Grid>
        <div className="realm-groups-editor__controls">
          <div>
            <ClearableInput
              id="addRealmGrouping"
              name="newGroupName"
              label="New Group Name"
              placeholder="What would you like to call the new group?"
              value={newName}
              onChange={(e) => {
                const tempName = e.currentTarget.value;
                const slugName = slugify(tempName);

                if (
                  tempName &&
                  fragmentGroups.some((x) => x.code === slugName)
                ) {
                  setError('Name must be unique within realm.');
                }

                setNewName(tempName);
              }}
            />
            <div className="realm-groups-editor__error">{error}</div>
          </div>
          <Button
            className="realm-groups-editor__add"
            btnStyle="primary"
            disabled={!newName}
            onClick={() => {
              const name = newName;

              props.onChange([
                ...fragmentGroups,
                {
                  id: 0,
                  name,
                  code: slugify(name),
                  isOrdered: false,
                  entries: []
                }
              ]);
            }}
          >
            Add {newName || 'New'} Group
          </Button>
        </div>
      </div>
    </FragmentContext.Provider>
  );
}
