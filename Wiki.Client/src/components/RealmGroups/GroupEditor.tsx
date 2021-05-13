import React, { useContext, useState } from 'react';

import generateUniqueId from 'ayaka/generateUniqueId';
import filterFalsey from 'ayaka/helpers/filterFalsey';

import Icons from 'meiko/constants/icons';
import AutocompleteInput from 'meiko/AutocompleteInput';
import ClearableInput from 'meiko/ClearableInput';
import Grid from 'meiko/Grid';
import Tickbox from 'meiko/Tickbox';
import { Button } from 'meiko/Button';

import groupEditorValidator from 'src/utils/groupEditorValidator';
import moveToNewArrayPosition from 'src/utils/moveToNewArrayPosition';

import { RealmShard, RealmShardEntry } from 'src/interfaces/RealmShard';

import './GroupEditor.scss';

export const FragmentContext = React.createContext([] as RealmShardEntry[]);

interface GroupEditorProps {
  data: RealmShard;
  onUpdate: (data: RealmShard) => void;
  onRemove: (code: string) => void;
}

export default function GroupEditor(props: GroupEditorProps) {
  const fragmentOptions = useContext(FragmentContext);
  const [groupUid] = useState(generateUniqueId);
  const [filter, setFilter] = useState('');

  const errors = groupEditorValidator(props.data);
  const groupEntries = props.data.entries.slice(0);

  function updateOrder(index: number, direction: number) {
    const entries = moveToNewArrayPosition(
      groupEntries,
      index,
      index + direction
    );

    props.onUpdate({
      ...props.data,
      entries
    });
  }
  console.log('GroupEditor > ', props.data, errors);
  return (
    <li className="group-editor">
      <div className="group-editor__meta-controls">
        <div className="group-editor__input-control">
          <ClearableInput
            id={`group_${groupUid}_name`}
            name="groupName"
            label="Group Name"
            placeholder="Enter a name for the group"
            value={props.data.name}
            required
            onChange={(e) =>
              props.onUpdate({
                ...props.data,
                name: e.currentTarget.value
              })
            }
          />
          {errors.has('name') && (
            <p className="group-editor__error">{errors.get('name')}</p>
          )}
        </div>

        <Tickbox
          id="isOrdered"
          name="isOrdered"
          text="Is Ordered"
          checked={props.data.isOrdered}
          onChange={(e) =>
            props.onUpdate({
              ...props.data,
              isOrdered: e.currentTarget.checked
            })
          }
        />
        <Button
          className="group-editor__remove"
          icon={Icons.cross}
          title="Remove Group"
          aria-label="Remove Group"
          onClick={() => props.onRemove(props.data.code)}
        />
      </div>
      <div className="group-editor__list">
        <AutocompleteInput
          id="findFragment"
          label="Find fragment..."
          attr="name"
          filter={filter}
          items={fragmentOptions.map((x) => ({
            id: x.fragmentId,
            name: x.fragmentName
          }))}
          onChange={(e) => setFilter(e.currentTarget?.value ?? '')}
          onSelect={(fragmentId) => {
            const selected = fragmentOptions.find(
              (f) => f.fragmentId === fragmentId
            );

            setFilter('');
            props.onUpdate({
              ...props.data,
              entries: [...groupEntries, selected].filter(filterFalsey)
            });
          }}
          noSuggestionsItem={<div>No fragments match the current filter.</div>}
        />
        <Grid
          className="group-editor__fragments"
          items={groupEntries}
          noItemsText={'Group has no fragment entries'}
        >
          {(item: RealmShardEntry, index: number) => {
            const removeLabel = `Remove ${item.fragmentName} from group`;
            const upLabel = `Move ${item.fragmentName} earlier in group entries`;
            const downLabel = `Move ${item.fragmentName} later in group entries`;

            return (
              <li
                key={item.fragmentId}
                className="group-editor__entry group-fragment"
              >
                {props.data.isOrdered && (
                  <div className="group-fragment__order">
                    <Button
                      className="group-fragment__up"
                      icon={Icons.up}
                      title={upLabel}
                      aria-label={upLabel}
                      disabled={index === 0}
                      onClick={() => updateOrder(index, -1)}
                    />
                    <Button
                      className="group-fragment__down"
                      icon={Icons.down}
                      title={downLabel}
                      aria-label={downLabel}
                      disabled={index >= groupEntries.length - 1}
                      onClick={() => updateOrder(index, 1)}
                    />
                  </div>
                )}
                <div>{item.fragmentName}</div>
                <div className="flex-spacer"></div>
                <Button
                  className="group-fragment__remove"
                  icon={Icons.cross}
                  title={removeLabel}
                  aria-label={removeLabel}
                  onClick={() =>
                    props.onUpdate({
                      ...props.data,
                      entries: groupEntries.filter(
                        (x) => x.fragmentId !== item.fragmentId
                      )
                    })
                  }
                />
              </li>
            );
          }}
        </Grid>
      </div>
    </li>
  );
}
