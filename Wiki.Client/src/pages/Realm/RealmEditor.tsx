import React, { useReducer } from 'react';
import { Helmet } from 'react-helmet';

import { Button } from 'meiko/Button';
import ClearableInput from 'meiko/ClearableInput';
import Tickbox from 'meiko/Tickbox';

import TitleSeparator from 'src/components/TitleSeparator';

// import { useAsync } from 'src/hooks/useAsync';
// import sendRequest from 'src/utils/sendRequest';

import { Realm } from 'src/interfaces/Realm';
import { PageProps } from 'src/interfaces/PageProps';

import './RealmEditor.scss';

interface RealmEditorProps extends PageProps<{ realmCode: string }> {
  data: Realm;
}

type RealmEditorAction =
  | { type: 'OnChange'; name: string; value: any }
  | { type: 'SubmitFailure'; errorMessages: string[] };

interface RealmEditorState {
  errorMessages?: string[];
  form: Realm;
  page: {};
}

function reducer(state: RealmEditorState, action: RealmEditorAction) {
  switch (action.type) {
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
  const [state, dispatch] = useReducer(reducer, { form: data, page: {} });

  console.log('RealmEditor > ', props);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // todo...
    console.log('Submitted...need to implement', state);
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
