import React, { useEffect, useRef } from "react";
import { StacksEditor } from "@stackoverflow/stacks-editor";

const StackEditor = ({ initialContent = "", onChange }) => {
  const editorRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      instanceRef.current = new StacksEditor(editorRef.current, initialContent, {
        parserFeatures: {
          tables: true,
        },
        onEditorChange: () => {
          const updated = instanceRef.current.getMarkdown();
          onChange?.(updated);
        },
      });
    }

    return () => {
      instanceRef.current?.destroy();
    };
  }, [initialContent, onChange]);

  return <div ref={editorRef} />;
};

export default StackEditor;
