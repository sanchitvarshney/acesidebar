import React, { useState } from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ImageViewComponent= ({ images }: { images: any }) => {
  //   const handleRemove = (index: number) => {
  //     setImages((prev) => prev.filter((_, i) => i !== index));
  //   };

  return (
    <div style={{ width:400}}>
    
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {images?.map((src: any,index:any) => (
          <div
            key={index}
            style={{
              position: "relative",
              width: "100px",
              height: "100px",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid #ccc",
            }}
          >
            <img
              src={src}
              alt={`attachment-${index}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* <IconButton
              size="small"
              onClick={() => handleRemove(index)}
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                background: "rgba(0,0,0,0.5)",
                color: "#fff",
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageViewComponent;
