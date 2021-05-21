import React, { useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet';

import generateUniqueId from 'ayaka/generateUniqueId';
import { Button } from 'meiko/Button';
import ClearableInput from 'meiko/ClearableInput';
import ChipListInput, { ChipListOption } from 'meiko/ChipListInput';
import { useAsync } from 'meiko/hooks/useAsync';

import Markdown from 'src/components/Markdown';
import ErrorDisplay from 'src/components/ErrorDisplay';

import sendRequest from 'src/utils/sendRequest';
import { mapTagToChipListOption } from 'src/utils/mappers';

import { FragmentView } from 'src/interfaces/Fragment';
import { RealmView } from 'src/interfaces/Realm';
import { Tag, TagInput, TagOption } from 'src/interfaces/Tag';
import { PageProps } from 'src/interfaces/PageProps';

interface FragmentFormViewProps
  extends PageProps<{ realmCode: string; fragmentCode?: string }> {
  data: RealmView;
}

type FragmentEditorAction =
  | { type: 'AddTag'; value: TagInput }
  | { type: 'UpdateTag'; value: ChipListOption[] }
  | { type: 'OnChange'; name: string; value: any }
  | { type: 'SubmitFailure'; errorMessages: string[] }
  | { type: 'LoadForm'; value: FragmentView };

interface FragmentEditorState {
  errorMessages?: string[];
  form: Partial<FragmentView>;
  tags: (Tag | TagInput)[];
}

function reducer(state: FragmentEditorState, action: FragmentEditorAction) {
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
    case 'SubmitFailure':
      return { ...state, errorMessages: action.errorMessages };
    case 'LoadForm':
      return { ...state, form: action.value, tags: action.value.tags };
    default:
      return state;
  }
}

function FragmentFormView(props: FragmentFormViewProps) {
  const realmId = props.data.id;
  const { realmCode, fragmentCode } = props.match.params;
  const [state, dispatch] = useReducer(reducer, {
    form: { name: '' },
    tags: []
  });

  const { loading, value } = useAsync(
    async () =>
      fragmentCode
        ? sendRequest<FragmentView>(`fragment/${fragmentCode}`)
        : Promise.resolve(),
    [fragmentCode]
  );

  useEffect(() => {
    if (!loading && value && value.success) {
      dispatch({ type: 'LoadForm', value: value.data });
    }
  }, [fragmentCode, loading, value]);

  const tagState = useAsync(
    async () =>
      sendRequest<TagOption[]>(`tag/getfragmenttagsinrealm/${realmCode}`),
    [realmCode]
  );

  const tagOptions: ChipListOption[] = tagState.value?.data ?? [];
  const fragmentName = value && value.success ? value.data.name : '';
  const fragmentFormTitle = fragmentCode
    ? `Editing ${fragmentName}`
    : 'New Fragment';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      realmId,
      ...state.form,
      tagList: state.tags.map((x) => ('code' in x ? x : { name: x.name }))
    };

    const endpoint = fragmentCode ? `fragment/update` : `fragment/create`;
    const response = await sendRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (response.success) {
      props.history.push(`/${realmCode}/${response.data.code}`);
    } else {
      dispatch({
        type: 'SubmitFailure',
        errorMessages: response.errorMessages
      });
    }
  }

  return (
    <div className="page">
      <Helmet title={fragmentFormTitle} />
      <form
        name="FragmentForm"
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
            <Button
              onClick={() =>
                props.history.push(
                  fragmentCode
                    ? `/${realmCode}/${fragmentCode}`
                    : `/${realmCode}`
                )
              }
            >
              Abandon
            </Button>
          </div>
        </header>
        <div className="page__content">
          <Markdown
            data={state.form.content}
            onChange={(value) =>
              dispatch({
                type: 'OnChange',
                name: 'content',
                value
              })
            }
          />
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
            createNewMessage="Add new fragment tag"
          />
        </div>

        <ErrorDisplay messages={state.errorMessages} />
      </form>
    </div>
  );
}

export default FragmentFormView;
