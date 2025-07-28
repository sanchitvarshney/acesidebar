import { Button, TextField } from "@mui/material";
import React from "react";
import StyledTextField from "../../reusable/AddNotes";
import NotesItem from "../../reusable/NotesItem";

// import emptyImg from "../../../public/image/empty.svg";

const NotesTab = () => {
  const [isNotes, setIsNotes] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [note, setNote] = React.useState("");
  const [noteList, setNoteList] = React.useState<any>([]);
  const [editNoteId, setEditNoteId] = React.useState<number | null>(null);
  const handleInputText = (text: string) => {
    if (text.length <= 500) {
      setNote(text);
    }
  };
  const handleSave = () => {
    if (editNoteId) {
      setNoteList((prev: any) =>
        prev.map((item: any) =>
          item.id === editNoteId ? { ...item, note } : item
        )
      );
      setEditNoteId(null);
      setIsEdit(false);
    } else {
      setNoteList((prev: any) => [
        ...prev,
        {
          id: new Date().getTime(),
          note: note,
          createdBy: "Current User",
          createdAt: new Date().toLocaleString(),
        },
      ]);
    }
    setIsNotes(false);
    setNote("");
  };

  const handleDelete = (id: any) => {
    setNoteList(noteList.filter((item: any) => item.id !== id));
  };

  const handleEdit = (id: number) => {
    const noteToEdit = noteList.find((item: any) => item.id === id);
    if (noteToEdit) {
      setNote(noteToEdit.note);
      setEditNoteId(id);
      setIsEdit(true);
    }
  };

  const renderContent = (
    <div>
      {isNotes ? (
        <div>
          {" "}
          <StyledTextField
            placeholder="Write your note here"
            inputText={handleInputText}
            note={note}
            onCancel={()=>setIsNotes(false)}
            handleSave={handleSave}
          />
        </div>
      ) : (
        <span
          className="text-sm text-green-600 cursor-pointer p-2"
          onClick={() => setIsNotes(true)}
        >
          + Add note
        </span>
      )}
    </div>
  );
  return (
    <div className="bg-white rounded border border-gray-200 p-3 mb-4">
      <div className="font-semibold text-sm text-gray-700 mb-2">Notes</div>

      {renderContent}

      {noteList.length > 0 ? (
        <div className="mt-4">
          {noteList.map((item: any) => (
            <NotesItem
              data={item}
              handleDelete={() => handleDelete(item.id)}
              handleEdit={() => handleEdit(item.id)}
              isEdit={isEdit}
              handleSave={handleSave}
              note={note}
              inputText={handleInputText}
              editNoteId={editNoteId}
              onEdit={()=>setIsEdit(false)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-4">
          <img
            src={"/image/empty.svg"}
            alt="notes"
            className="mx-auto w-40 h-30 "
          />
          <span className="text-sm text-gray-600 text-center">
            List is empty
          </span>
        </div>
      )}
    </div>
  );
};

export default NotesTab;
