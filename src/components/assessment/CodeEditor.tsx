import React, { useRef, useEffect, useState } from 'react';

// For now, we'll use a simple textarea until Monaco Editor is properly set up
interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  height?: string;
  theme?: string;
  readOnly?: boolean;
  options?: any;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  value,
  onChange,
  height = '400px',
  theme = 'vs-dark',
  readOnly = false,
  options = {}
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
        {language}
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        readOnly={readOnly}
        style={{ height, width: '100%' }}
        className={`
          w-full p-4 font-mono text-sm border border-gray-300 rounded-md resize-none
          ${theme === 'vs-dark' ? 'bg-gray-900 text-green-400' : 'bg-white text-gray-900'}
          ${readOnly ? 'cursor-not-allowed opacity-75' : ''}
        `}
        placeholder={`Write your ${language} code here...`}
        spellCheck={false}
      />
    </div>
  );
};

export default CodeEditor;