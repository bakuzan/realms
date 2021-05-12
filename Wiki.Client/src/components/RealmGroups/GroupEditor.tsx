import React, { useContext, useState } from 'react';

import filterFalsey from 'ayaka/helpers/filterFalsey';
import Icons from 'meiko/constants/icons';
import AutocompleteInput from 'meiko/AutocompleteInput';
import ClearableInput from 'meiko/ClearableInput';
import Grid from 'meiko/Grid';
import Tickbox from 'meiko/Tickbox';
import { Button } from 'meiko/Button';

import moveToNewArrayPosition from 'src/utils/moveToNewArrayPosition';

import { RealmShard, RealmShardEntry } from 'src/interfaces/RealmShard';

export const FragmentContext = React.createContext([] as RealmShardEntry[]);

interface GroupEditorProps {
  data: RealmShard;
  onUpdate: (data: RealmShard) => void;
  onRemove: (code: string) => void;
}

export default function GroupEditor(props: GroupEditorProps) {
  const fragmentOptions = useContext(FragmentContext);
  const [filter, setFilter] = useState('');

  return (
    <React.Fragment>
      <div className="group-editor__meta-controls">
        <ClearableInput
          name="groupName"
          placeholder="Group Name"
          value={props.data.name}
          onChange={(e) =>
            props.onUpdate({
              ...props.data,
              name: e.currentTarget.value
            })
          }
        />
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
          onChange={() => props.onRemove(props.data.code)}
        />
      </div>
      <div>
        <AutocompleteInput
          id="findFragment"
          label="Find fragment..."
          filter={filter}
          items={fragmentOptions.map((x) => ({
            id: x.fragmentId,
            name: x.fragmentName
          }))}
          onChange={(e) => setFilter(e.currentTarget.value)}
          onSelect={(id) =>
            props.onUpdate({
              ...props.data,
              entries: [
                ...props.data.entries,
                fragmentOptions.find((f) => f.id === id)
              ].filter(filterFalsey)
            })
          }
          noSuggestionsItem={<li>No fragments match the current filter.</li>}
        />
        <Grid
          items={props.data.entries}
          noItemsText={'Group has no fragment entries'}
        >
          {(item: RealmShardEntry, index: number) => {
            const removeLabel = `Remove ${item.fragmentName} from group`;
            const upLabel = `Move ${item.fragmentName} earlier in group entries`;
            const downLabel = `Move ${item.fragmentName} later in group entries`;

            function updateOrder(direction: number) {
              props.onUpdate({
                ...props.data,
                entries: moveToNewArrayPosition(
                  props.data.entries,
                  index,
                  index + direction
                )
              });
            }

            return (
              <div
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
                      onChange={() => updateOrder(-1)}
                    />
                    <Button
                      className="group-fragment__down"
                      icon={Icons.down}
                      title={downLabel}
                      aria-label={downLabel}
                      disabled={index >= props.data.entries.length - 1}
                      onChange={() => updateOrder(1)}
                    />
                  </div>
                )}
                <div>{item.fragmentName}</div>
                <Button
                  className="group-fragment__remove"
                  icon={Icons.cross}
                  title={removeLabel}
                  aria-label={removeLabel}
                  onChange={() =>
                    props.onUpdate({
                      ...props.data,
                      entries: props.data.entries.filter(
                        (x) => x.fragmentId !== item.fragmentId
                      )
                    })
                  }
                />
              </div>
            );
          }}
        </Grid>
      </div>
    </React.Fragment>
  );
}
