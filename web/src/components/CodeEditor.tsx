'use client';

import MonacoEditor from '@monaco-editor/react';
import { useCallback } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = 'python',
  readOnly = false,
  height = '100%',
}: CodeEditorProps) {
  const handleChange = useCallback((v: string | undefined) => {
    onChange(v ?? '');
  }, [onChange]);

  return (
    <MonacoEditor
      height={height}
      language={language}
      value={value}
      onChange={handleChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        wordWrap: 'on',
        readOnly,
        padding: { top: 16, bottom: 16 },
      }}
    />
  );
}
