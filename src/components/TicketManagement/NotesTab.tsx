import { Button, TextField } from "@mui/material";
import React from "react";
import StyledTextField from "../../reusable/AddNotes";
import NotesItem from "../../reusable/NotesItem";
import { set } from "react-hook-form";

const NotesTab = () => {
  const [isNotes, setIsNotes] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [note, setNote] = React.useState("");
  const [noteList, setNoteList] = React.useState<any[]>([]);
  const [editNoteId, setEditNoteId] = React.useState<number | null>(null);

  const handleInputText = (text: string) => {
    if (text.length <= 500) {
      setNote(text);
    }
  };

  const handleSave = () => {
    if (editNoteId !== null) {
      setNoteList((prev) =>
        prev.map((item) =>
          item.id === editNoteId ? { ...item, note } : item
        )
      );
      setEditNoteId(null);
      setIsEdit(false);
    } else {
      setNoteList((prev) => [
        ...prev,
        {
          id: Date.now(),
          note,
          createdBy: "Current User",
          createdAt: new Date().toLocaleString(),
        },
      ]);
    }
    setIsNotes(false);
    setNote("");
  };

  const handleDelete = (id: number) => {
    setNoteList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (id: number) => {
    setIsNotes(false);
    const noteToEdit = noteList.find((item) => item.id === id);
    if (noteToEdit) {
      setNote(noteToEdit.note);
      setEditNoteId(id);
      setIsEdit(true);
      setIsNotes(true); // show editor when editing
    }
  };

  const handleCancel = () => {
    setIsNotes(false);
    setIsEdit(false);
    setEditNoteId(null);
    setNote("");
  };

  return (
    <div className="bg-white rounded border border-gray-200 p-3 mb-4">
      {(isNotes && !isEdit) && (
        <StyledTextField
          placeholder="Write your note here"
          inputText={handleInputText}
          note={note}
          onCancel={handleCancel}
          handleSave={handleSave}
        />
      )}

      {noteList.length > 0 ? (
        <div className="mb-0">
          {!isNotes && (
            <div className="flex items-center justify-end mb-2">
              <span
                className="text-sm text-[#0891b2] cursor-pointer p-2"
                onClick={() => setIsNotes(true)}
              >
                + Add note
              </span>
            </div>
          )}
          {noteList.map((item) => (
            <NotesItem
              key={item.id} // ✅ Added key
              data={item}
              handleDelete={() => handleDelete(item.id)}
              handleEdit={() => handleEdit(item.id)}
              isEdit={isEdit}
              handleSave={handleSave}
              note={note}
              inputText={handleInputText}
              editNoteId={editNoteId}
              onEdit={() => setIsEdit(false)}
            />
          ))}
        </div>
      ) : (
        !isNotes && (
          <div className="flex flex-col items-center mt-4">
            <img
              src={"/image/empty.svg"}
              alt="notes"
              className="mx-auto w-40 h-30"
            />
            <span
              className="text-sm text-[#0891b2] cursor-pointer p-2"
              onClick={() => setIsNotes(true)}
            >
              + Add note
            </span>
          </div>
        )
      )}
    </div>
  );
};

export default NotesTab;
