import React, { useReducer } from 'react';
import { Helmet } from 'react-helmet';

import Form from 'meiko/Form';
import Tickbox from 'meiko/Tickbox';
import ClearableInput from 'meiko/ClearableInput';

import TitleSeparator from 'src/components/TitleSeparator';
import ErrorDisplay from 'src/components/ErrorDisplay';

import sendRequest from 'src/utils/sendRequest';

import { PageProps } from 'src/interfaces/PageProps';

import './RealmCreator.scss';

type RealmCreatorProps = PageProps<{ realmCode?: string }>;
type RealmCreatorAction =
  | { type: 'OnChange'; name: string; value: any }
  | { type: 'SubmitFailure'; errorMessages: string[] };

interface RealmCreatorState {
  errorMessages?: string[];
  form: {
    name: string;
    isAuthenticationRestricted: boolean;
    isPrivate: boolean;
  };
}

function reducer(state: RealmCreatorState, action: RealmCreatorAction) {
  switch (action.type) {
    case 'OnChange':
      return { ...state, form: { ...state.form, [action.name]: action.value } };
    case 'SubmitFailure':
      return { ...state, errorMessages: action.errorMessages };
    default:
      return state;
  }
}

const realmCreatorDefaults = {
  form: {
    name: '',
    isAuthenticationRestricted: false,
    isPrivate: false
  }
};

function RealmCreator(props: RealmCreatorProps) {
  const [state, dispatch] = useReducer(reducer, realmCreatorDefaults);

  function onCancel() {
    props.history.goBack();
  }

  async function onSubmit() {
    const payload = { ...state.form };
    const response = await sendRequest(`realm/create`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (response.success) {
      props.history.push(`/${response.data.code}/edit`);
    } else {
      dispatch({
        type: 'SubmitFailure',
        errorMessages: response.errorMessages
      });
    }
  }

  return (
    <div className="realm-creator">
      <Helmet title="New Realm" />

      <Form
        name="CreateRealm"
        title="New Realm"
        cancelOptions={{ text: 'Abandon', onCancel }}
        submitOptions={{ text: 'Create', btnStyle: 'primary', onSubmit }}
      >
        <ClearableInput
          id="name"
          name="name"
          placeholder="Name"
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
      </Form>
      <ErrorDisplay messages={state.errorMessages} />
    </div>
  );
}

export default RealmCreator;
