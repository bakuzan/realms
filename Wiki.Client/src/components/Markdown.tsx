import classNames from 'classnames';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import highlight from 'rehype-highlight';
import gfm from 'remark-gfm';
import * as codemirror from 'codemirror';
import { Controlled as CodeMirror } from 'react-codemirror2';

import { Container, View } from 'meiko/Tabs';

import MarkdownHelp from './MarkdownHelp';

import 'codemirror/lib/codemirror.css';
import './Markdown.scss';

interface MarkdownProps {
  data?: string;
  onChange?: (value: string) => void;
}

const options = {
  mode: 'markdown',
  theme: 'default',
  lineNumbers: false
};

function Markdown(props: MarkdownProps) {
  const isEditor = props.onChange !== undefined;
  const value = props.data ?? '';
  const [activeTab, setActiveTab] = useState(isEditor ? 'Editor' : 'Preview');

  function onChange(
    editor: codemirror.Editor,
    data: codemirror.EditorChange,
    content: string
  ) {
    if (props.onChange) {
      props.onChange(content);
    }
  }

  return (
    <Container
      activeTab={activeTab}
      onChange={(name) => setActiveTab(name)}
      className={classNames('rlm-markdown', {
        'rlm-markdown--content': !isEditor,
        'rlm-markdown--editor': isEditor
      })}
    >
      <View name="Editor" disabled={!isEditor}>
        <CodeMirror
          value={value}
          options={options}
          onBeforeChange={onChange}
          onChange={onChange}
        />
      </View>

      <View name="Preview">
        <div className="rlm-markdown__markdown">
          <ReactMarkdown
            rehypePlugins={[highlight]}
            remarkPlugins={[gfm]}
            children={value}
          />
        </div>
      </View>

      <View name="Help" disabled={!isEditor}>
        <MarkdownHelp />
      </View>
    </Container>
  );
}

export default Markdown;
