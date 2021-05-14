import React, { useReducer } from 'react';
import { Helmet } from 'react-helmet';

import generateUniqueId from 'ayaka/generateUniqueId';
import filterFalsey from 'ayaka/helpers/filterFalsey';

import { Button } from 'meiko/Button';
import ClearableInput from 'meiko/ClearableInput';
import Tickbox from 'meiko/Tickbox';
import ChipListInput, { ChipListOption } from 'meiko/ChipListInput';
import { useAsync } from 'meiko/hooks/useAsync';

import TitleSeparator from 'src/components/TitleSeparator';
import ErrorDisplay from 'src/components/ErrorDisplay';
import RealmGroups from 'src/components/RealmGroups';

import sendRequest from 'src/utils/sendRequest';
import { mapTagToChipListOption } from 'src/utils/mappers';

import { RealmView } from 'src/interfaces/Realm';
import { RealmShard } from 'src/interfaces/RealmShard';
import { Tag, TagInput, TagOption } from 'src/interfaces/Tag';
import { PageProps } from 'src/interfaces/PageProps';

import './RealmEditor.scss';
import groupEditorValidator from 'src/utils/groupEditorValidator';

interface RealmEditorProps extends PageProps<{ realmCode: string }> {
  data: RealmView;
  onUpdate: () => void;
}

type RealmEditorAction =
  | { type: 'AddTag'; value: TagInput }
  | { type: 'UpdateTag'; value: ChipListOption[] }
  | { type: 'OnChange'; name: string; value: any }
  | { type: 'UpdateShard'; shards: RealmShard[] }
  | { type: 'SubmitFailure'; errorMessages: string[] };

interface RealmEditorState {
  errorMessages?: string[];
  form: RealmView;
  shards: RealmShard[];
  tags: (Tag | TagInput)[];
}

function reducer(state: RealmEditorState, action: RealmEditorAction) {
  switch (action.type) {
    case 'AddTag':
      return {
        ...state,
        tags: [...state.tags, action.value]
      };
    case 'UpdateTag':
      return {
        ...state,
        tags: action.value.map(
          (x) =>
            state.tags.find((t) => t.id === x.id) ??
            ({ id: x.id, name: x.name } as TagInput)
        )
      };
    case 'OnChange':
      return { ...state, form: { ...state.form, [action.name]: action.value } };
    case 'UpdateShard':
      return { ...state, shards: action.shards };
    case 'SubmitFailure':
      return { ...state, errorMessages: action.errorMessages };
    default:
      return state;
  }
}

function RealmEditor(props: RealmEditorProps) {
  const { data } = props;
  const realmCode = data.code;
  const [state, dispatch] = useReducer(reducer, {
    form: data,
    shards: data.shards,
    tags: data.tags
  });

  const tagState = useAsync(
    async () => sendRequest<TagOption[]>(`tag/getrealmtags`),
    []
  );

  const tagOptions: ChipListOption[] = tagState.value?.data ?? [];
  const hasShardError = state.shards.some(
    (x) => x.code && groupEditorValidator(x).size > 0
  );

  console.log('RealmEditor > ', props, state);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (hasShardError) {
      return;
    }

    const payload = {
      ...state.form,
      tagList: state.tags.map((x) => ('code' in x ? x : { name: x.name })),
      shards: state.shards
        .filter((x) => filterFalsey(x.code))
        .map((x) => ({
          ...x,
          id: x.id === 0 ? null : x.id,
          entryList: x.entries.map((e) => ({
            fragmentId: e.fragmentId
          }))
        }))
    };

    const response = await sendRequest(`realm/update`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    console.log(
      '%c UPDATED..? >',
      'color: purple; font-size: 16px;',
      response,
      state
    );

    if (response.success) {
      props.onUpdate();
      props.history.push(`/${response.data.code}`);
    } else {
      dispatch({
        type: 'SubmitFailure',
        errorMessages: response.errorMessages
      });
    }
  }

  return (
    <div className="page">
      <Helmet title={`Editing`} />
      <form
        name="RealmEditor"
        noValidate
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <header className="page__header">
          <ClearableInput
            id="name"
            name="name"
            label="Name"
            value={state.form.name}
            onChange={(e) =>
              dispatch({
                type: 'OnChange',
                name: e.currentTarget.name,
                value: e.currentTarget.value
              })
            }
          />
          <div className="button-group">
            <Button type="submit" btnStyle="primary" disabled={hasShardError}>
              Save
            </Button>
            <Button onClick={() => props.history.push(`/${realmCode}`)}>
              Abandon
            </Button>
          </div>
        </header>
        <div className="page-grid">
          <div className="page-grid__core">
            <div className="panel">
              <RealmGroups
                baseUrl={realmCode}
                data={state.shards}
                onChange={(shards) => dispatch({ type: 'UpdateShard', shards })}
              />

              <TitleSeparator title="Tags" />

              <ChipListInput
                id="tags"
                tagClassName="rlm-tag"
                menuClassName="rlm-autocomplete-menu"
                label="Tags"
                attr="name"
                name="tags"
                chipsSelected={state.tags.map(mapTagToChipListOption)}
                chipOptions={tagOptions}
                disableLocalFilter={tagOptions.length === 0}
                updateChipList={(_, value) =>
                  dispatch({
                    type: 'UpdateTag',
                    value
                  })
                }
                createNew={(newTag) => {
                  dispatch({
                    type: 'AddTag',
                    value: { id: generateUniqueId(), name: newTag.name }
                  });
                }}
                createNewMessage="Add new realm tag"
              />
            </div>
          </div>
          <div className="page-grid__side">
            <div className="panel">
              <TitleSeparator title="Permissions" />
              <Tickbox
                id="isAuthenticationRestricted"
                name="isAuthenticationRestricted"
                text="Require user to be logged in to view?"
                checked={state.form.isAuthenticationRestricted}
                onChange={(e) =>
                  dispatch({
                    type: 'OnChange',
                    name: e.currentTarget.name,
                    value: e.currentTarget.checked
                  })
                }
              />
              <Tickbox
                id="isPrivate"
                name="isPrivate"
                text="For your eyes only?"
                checked={state.form.isPrivate}
                onChange={(e) =>
                  dispatch({
                    type: 'OnChange',
                    name: e.currentTarget.name,
                    value: e.currentTarget.checked
                  })
                }
              />
            </div>
          </div>
        </div>
        <ErrorDisplay messages={state.errorMessages} />
      </form>
    </div>
  );
}

export default RealmEditor;
