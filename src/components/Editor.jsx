import React, { useEffect, useState } from "react";

import { Editor } from 'primereact/editor';

const StackEditor = ({ initialContent = "", onChange }) => {


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

  
 const renderHeader = () => {
        return (
            <span className="ql-formats">
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
                <button className="ql-link" aria-label="Link"></button>
                <button className="ql-image" aria-label="Image"></button>
            </span>
        );
    };

    const header = renderHeader();

  return (
     <Editor value={initialContent} onTextChange={(e) => onChange(e.htmlValue)} style={{ height: '180px' }} headerTemplate={header} />
  );
};

export default StackEditor;
