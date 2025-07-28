// StyledTextField.jsx
import React from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";


const getCharacters = (text: string) => {
  const val = 500 - text.length;
  if (val < 0) {
    return 0;
  } else {
    return val;
  }
};
const AddNotes = ({ label = "Write your note here", rows = 4, ...props }) => {
  const { inputText,note,onCancel,handleSave, } = props;
  return (
    <>
      <TextField
        //   label={label}
        placeholder={label}
        onChange={(e) => inputText(e.target.value)}
        multiline
        value={note}
        rows={rows}
        InputLabelProps={{ shrink: true }}
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#ccc", // default border
            },
            "&:hover fieldset": {
              borderColor: "#ccc", // border color on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#000", // border color on focus
              // backgroundColor: "#fff",
            },
          },
          "& .MuiInputLabel-root": {
            fontStyle: "italic",
            color: "#999", // default label color
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "green", // label color on focus
          },
          "& .MuiOutlinedInput-input::placeholder": {
            fontStyle: "italic",
            color: "gray",
            opacity: 1,
          },
        }}
        {...props}
      />
      <p className="text-xs text-gray-500  text-right my-3">{`${
        note.length === 0 ? 500 : getCharacters(note)
      } remaining characters`}</p>
      <div className="flex justify-end gap-2 mt-2">
        <Button
          variant="contained"
          color="inherit"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button variant="contained" color="success" onClick={handleSave}>
          Save
        </Button>
      </div>
    </>
  );
};

export default AddNotes;
