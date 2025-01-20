// src/components/CodeEditor.tsx
import { useState } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  onSubmit: (code: string, language: string) => void;
}

export default function CodeEditor({ onSubmit }: CodeEditorProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  const handleSubmit = () => {
    onSubmit(code, language);
  };

  return (
    <div className="card">
      <div className="mb-4">
        <select
          className="input-field"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="go">Go</option>
        </select>
      </div>
      
      <Editor
        height="400px"
        language={language}
        value={code}
        onChange={(value) => setCode(value || '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
      />
      
      <button
        className="btn-primary mt-4"
        onClick={handleSubmit}
      >
        Submit for Review
      </button>
    </div>
  );
}