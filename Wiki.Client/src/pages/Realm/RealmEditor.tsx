import React, { useReducer } from 'react';
import { Helmet } from 'react-helmet';

import generateUniqueId from 'ayaka/generateUniqueId';
import { Button } from 'meiko/Button';
import ClearableInput from 'meiko/ClearableInput';
import Tickbox from 'meiko/Tickbox';
import ChipListInput, { ChipListOption } from 'meiko/ChipListInput';

import TitleSeparator from 'src/components/TitleSeparator';

// import { useAsync } from 'src/hooks/useAsync';
import sendRequest from 'src/utils/sendRequest';
import { mapTagToChipListOption } from 'src/utils/mappers';

import { RealmView } from 'src/interfaces/Realm';
import { Tag, TagInput } from 'src/interfaces/Tag';
import { PageProps } from 'src/interfaces/PageProps';

import './RealmEditor.scss';

interface RealmEditorProps extends PageProps<{ realmCode: string }> {
  data: RealmView;
}

type RealmEditorAction =
  | { type: 'AddTag'; value: TagInput }
  | { type: 'OnChange'; name: string; value: any }
  | { type: 'SubmitFailure'; errorMessages: string[] };

interface RealmEditorState {
  errorMessages?: string[];
  form: RealmView;
  tags: (Tag | TagInput)[];
}

function reducer(state: RealmEditorState, action: RealmEditorAction) {
  switch (action.type) {
    case 'AddTag':
      return {
        ...state,
        tags: [...state.tags, action.value]
      };
    case 'OnChange':
      return { ...state, form: { ...state.form, [action.name]: action.value } };
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
    tags: data.tags
  });

  console.log('RealmEditor > ', props);

  const tagOptions: ChipListOption[] = []; // get these options...

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = { ...state.form, tags: state.tags };
    const response = await sendRequest(`realm/update`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    console.log('UPDATED..? >', response);

    if (response.success) {
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
        name="realmEditor"
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
            <Button type="submit" btnStyle="primary">
              Save
            </Button>
            <Button onClick={() => props.history.push(`/${realmCode}`)}>
              Abandon
            </Button>
          </div>
        </header>
        <div className="page-grid">
          <div className="page-grid__core">
            things will do here
            <br />
            need to create the component builder
            <br />
            <ChipListInput
              id="tags"
              tagClassName="rlm-tag"
              menuClassName="rlm-autocomplete-menu"
              label="Tags"
              attr="name"
              name="tags"
              chipsSelected={state.tags.map(mapTagToChipListOption)}
              chipOptions={tagOptions}
              updateChipList={(name, value) =>
                dispatch({
                  type: 'OnChange',
                  name,
                  value
                })
              }
              createNew={(newTag) => {
                dispatch({
                  type: 'AddTag',
                  value: { code: generateUniqueId(), name: newTag.name }
                });
              }}
              createNewMessage="Add new realm tag"
            />
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
      </form>
    </div>
  );
}

export default RealmEditor;
