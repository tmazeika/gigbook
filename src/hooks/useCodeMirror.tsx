import { basicSetup, EditorState, EditorView } from '@codemirror/basic-setup';
import { defaultTabBinding } from '@codemirror/commands';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { keymap } from '@codemirror/view';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export type Language = 'css' | 'html';

export interface CodeEditorHook {
  readonly value: string;
  readonly element: JSX.Element;
}

export default function useCodeEditor(language: Language): CodeEditorHook {
  const [doc, setDoc] = useState('');
  const element = useMemo(
    () => <Editor language={language} onChange={setDoc} />,
    [language],
  );
  return {
    value: doc,
    element,
  };
}

interface EditorProps {
  language: Language;

  onChange(value: string): void;
}

function Editor({ language, onChange }: EditorProps): JSX.Element {
  const parentRef = useRef(null);
  useEffect(() => {
    const view = new EditorView({
      state: EditorState.create({
        extensions: [
          basicSetup,
          keymap.of([defaultTabBinding]),
          language === 'css' ? css() : html(),
        ],
      }),
      parent: parentRef.current ?? undefined,
      dispatch(txn) {
        if (txn.docChanged) {
          onChange(txn.newDoc.toString());
        }
        view.update([txn]);
      },
    });
    return () => view.destroy();
  }, [language, onChange]);
  return <div ref={parentRef} />;
}
