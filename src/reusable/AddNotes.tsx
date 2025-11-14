import TextField from "@mui/material/TextField";
import { Button, CircularProgress } from "@mui/material";
import { CircuitBoardIcon } from "lucide-react";

const getCharacters = (text: string) => {
  const val = 100 - text.length;
  if (val < 0) {
    return 0;
  } else {
    return val;
  }
};
const AddNotes = ({ label = "Write your note here", rows = 4, inputText, note, onCancel, handleSave, ...props }:any) => {
  const {isEditLoading,addingLoading} = props;
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
        note.length === 0 ? 100 : getCharacters(note)
      } remaining characters`}</p>
      <div className="flex justify-end gap-2 mt-2">
        <Button 
          variant="text" 
         sx={{fontWeight:600}}
          onClick={onCancel}
          disabled={isEditLoading || addingLoading}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "#2566b0", color: "white" }}
          onClick={handleSave}
          disabled={isEditLoading || addingLoading || !note.trim()}
        >
          {
            isEditLoading || addingLoading ? <CircularProgress size={18}  color="inherit"/> : "Save"
          }
        </Button>
      </div>
    </>
  );
};

export default AddNotes;
