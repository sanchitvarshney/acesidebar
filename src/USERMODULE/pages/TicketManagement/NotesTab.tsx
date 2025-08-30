import { Button, TextField } from "@mui/material";
import React from "react";
import StyledTextField from "../../../reusable/AddNotes";
import NotesItem from "../../../reusable/NotesItem";
import emptyimg from "../../../assets/image/overview-empty-state.svg";
import { useCommanApiMutation } from "../../../services/threadsApi";
import { useToast } from "../../../hooks/useToast";

const NotesTab = ({ ticketData }: any) => {
  const { showToast } = useToast();
  const [isNotes, setIsNotes] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [note, setNote] = React.useState("");
  const [noteList, setNoteList] = React.useState<any[]>([]);
  const [editNoteId, setEditNoteId] = React.useState<number | null>(null);
  const [triggerAddNote] = useCommanApiMutation();
  const [triggerdeleteNote, { isLoading: isDeletingNote }] =
    useCommanApiMutation();

  const handleInputText = (text: string) => {
    if (text.length <= 100) {
      setNote(text);
    }
  };

  const handleSave = async () => {
    try {
      if (editNoteId !== null) {
        const payloadUpdate = {
          url: "update-note",
          body: {
            id: editNoteId, // Unique identifier of the note
            note: note, // Updated text entered by the use
          },
        };
        // commanApi(payloadUpdate)
        //   .then((res) => {})
        //   .catch((err) => {});

        setNoteList((prev) =>
          prev.map((item) =>
            item.id === editNoteId ? { ...item, note } : item
          )
        );

        setEditNoteId(null);
        setIsEdit(false);
      } else {
        const payload = {
          url: "internal-note",
          body: {
            ticket: ticketData?.ticketId,
            note,
          },
        };
        // Create new note
        triggerAddNote(payload).then((res) => {
          if (res?.data?.success !== true) {
            showToast(res?.data?.message || "An error occurred", "error");
            return;
          }
        });
      }
    } catch (err) {
      console.error("Error saving note:", err);
    }

    setIsNotes(false);
    setNote("");
  };

  const handleDelete = (id: number) => {
    const values = {
      note: id,
      ticket: ticketData?.ticketId,
    };
    const payload = {
      url: `internal-note/${values.note}/${values.ticket}`,
      method: "DELETE",
    };
    triggerdeleteNote(payload).then((res) => {
      if (res?.data?.success !== true) {
        showToast(res?.data?.message || "An error occurred", "error");
        return;
      }
      
    });
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
      {isNotes && !isEdit && (
        <StyledTextField
          placeholder="Write your note here"
          inputText={handleInputText}
          note={note}
          onCancel={handleCancel}
          handleSave={handleSave}
        />
      )}

      {ticketData?.notes.length > 0 ? (
        <div className="mb-0">
          {!isNotes && (
            <div className="flex items-center justify-end mb-2">
              <span
                className="text-sm text-[#1a73e8] cursor-pointer p-2"
                onClick={() => setIsNotes(true)}
              >
                + Add note
              </span>
            </div>
          )}
          {ticketData?.notes.map((item: any) => (
            <NotesItem
              key={item.key} // ✅ Added key
              data={item}
              handleDelete={() => handleDelete(item.key)}
              handleEdit={() => handleEdit(item.key)}
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
            <img src={emptyimg} alt="notes" className="mx-auto w-40 h-30" />
            <span
              className="text-sm text-[#1a73e8] cursor-pointer p-2"
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
