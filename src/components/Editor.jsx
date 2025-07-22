import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from "draft-js";
import draftToMarkdown from "draftjs-to-markdown";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../css/scoped-stack-editor.css";

const StackEditor = ({ initialContent = "", onChange }) => {
  const [editorState, setEditorState] = useState(() =>
    initialContent
      ? EditorState.createWithContent(
          ContentState.createFromText(initialContent)
        )
      : EditorState.createEmpty()
  );

  const isMounted = React.useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const uploadImageCallback = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        setTimeout(() => {
          if (isMounted.current) {
            resolve({
              data: { link: reader.result }, // This will be used as image src
            });
          }
        }, 0); // Defer to next event loop
      };

      reader.onerror = () => {
        if (isMounted.current) {
          reject(new Error("Image upload failed"));
        }
      };

      reader.readAsDataURL(file); // Convert to base64
    });
  };

  const safeSetEditorState = (state) => {
    if (isMounted.current) {
      setEditorState(state);
    }
  };

  useEffect(() => {
    const raw = convertToRaw(editorState.getCurrentContent());
    const markdown = draftToMarkdown(raw);
    onChange?.(markdown);
  }, [editorState, onChange]);

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={safeSetEditorState}
      wrapperClassName="wysiwyg-wrapper"
      editorClassName="wysiwyg-editor"
      toolbarClassName="wysiwyg-toolbar"
      toolbar={{
        options: [
          "inline",
          // 'blockType',
          // 'fontSize',
          "list",
          "textAlign",
          // 'colorPicker',
          // 'link',
          // 'embedded',
          // 'emoji',
          "image",
          // 'remove',
        ],
        image: {
          urlEnabled: true,
          uploadEnabled: true,
          uploadCallback: uploadImageCallback,
          previewImage: true,
          alt: { present: true, mandatory: false },
        },
        inline: {
          options: ["bold", "italic", "underline", "strikethrough"],
        },
      }}
    />
  );
};

export default StackEditor;
