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

export default function useCodeEditor(
  language: Language,
  initialDoc?: string,
): CodeEditorHook {
  const [initialDocState] = useState(initialDoc);
  const [doc, setDoc] = useState(initialDoc ?? '');
  const element = useMemo(
    () => (
      <Editor
        language={language}
        initialDoc={initialDocState}
        onChange={setDoc}
      />
    ),
    [language, initialDocState],
  );
  return {
    value: doc,
    element,
  };
}

interface EditorProps {
  language: Language;
  initialDoc?: string;

  onChange(value: string): void;
}

function Editor({ language, initialDoc, onChange }: EditorProps): JSX.Element {
  const parentRef = useRef(null);
  useEffect(() => {
    const view = new EditorView({
      state: EditorState.create({
        doc: initialDoc,
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
  }, [language, initialDoc, onChange]);
  return <div ref={parentRef} />;
}
