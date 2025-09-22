import { Button, CircularProgress, TextField } from "@mui/material";
import React, { useEffect } from "react";
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
  const [triggerdeleteNote] =
    useCommanApiMutation();
  const [triggerEditNote] =
    useCommanApiMutation();
  
  // Local loading states for better control
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleInputText = (text: string) => {
    if (text.length <= 100) {
      setNote(text);
    }
  };

  useEffect(() => {
    if (ticketData?.notes.length <= 0) return;
    setNoteList(ticketData?.notes);
  }, [ticketData]);

  const handleSave = async () => {
    if (isSaving) return; // Prevent multiple saves
    
    setIsSaving(true);
    try {
      if (editNoteId !== null) {
        const valueofPayload: any = {
          noteID: editNoteId,
          ticket: ticketData?.ticketId,
          note: note,
        };
        const payloadUpdate = {
          url: `internal-note/${valueofPayload.noteID}/${valueofPayload.ticket}`,
          method: "PUT",
          body: {
            note: valueofPayload.note, // Updated text entered by the use
          },
        };
        const res = await triggerEditNote(payloadUpdate);
        if (res?.data?.type === "error") {
          showToast(res?.data?.message || "An error occurred", "error");
          return;
        }
        if (res?.data?.type === "success") {
          showToast(res?.data?.message || "Note updated successfully", "success");
          setNoteList((prev) =>
            prev.map((item) =>
              item.key === editNoteId ? { ...item, note } : item
            )
          );
          setEditNoteId(null);
          setIsEdit(false);
          setNote("");
        }
      } else {
        const payload = {
          url: "internal-note",
          body: {
            ticket: ticketData?.ticketId,
            note,
          },
        };
        // Create new note
        const res = await triggerAddNote(payload);
        if (res?.data?.type === "error") {
          showToast(res?.data?.message || "An error occurred", "error");
          return;
        }
        if (res?.data?.type === "success") {
          showToast(res?.data?.message || "Note added successfully", "success");
          setNoteList((prev) => [res?.data?.data, ...prev]);
          setIsNotes(false);
          setNote("");
        }
      }
    } catch (err) {
      console.error("Error saving note:", err);
      showToast("An unexpected error occurred", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (isDeleting) return; // Prevent multiple deletes
    
    setIsDeleting(true);
    try {
      const values = {
        note: id,
        ticket: ticketData?.ticketId,
      };
      const payload = {
        url: `internal-note/${values.note}/${values.ticket}`,
        method: "DELETE",
      };
      const res = await triggerdeleteNote(payload);
      if (res?.data?.type === "error") {
        showToast(res?.data?.message || "An error occurred", "error");
        return;
      }
      if (res?.data?.type === "success") {
        showToast(res?.data?.message || "Note deleted successfully", "success");
        setNoteList((prev) => prev.filter((item) => item.key !== id));
      }
    } catch (err) {
      console.error("Error deleting note:", err);
      showToast("An unexpected error occurred", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (id: number) => {
    setIsNotes(false);
    const noteToEdit = noteList.find((item) => item.key === id);
    if (noteToEdit) {
      setNote(noteToEdit.note || noteToEdit.name || "");
      setEditNoteId(id);
      setIsEdit(true);
      setIsNotes(false);
    }
  };

  const handleCancel = () => {
    setIsNotes(false);
    setIsEdit(false);
    setEditNoteId(null);
    setNote("");
  };
  const handleEditCancel = () => {
    setIsEdit(false);
    setEditNoteId(null);
    setNote("");
  };

  return (
    <div className="flex flex-col bg-white rounded border border-gray-200 h-[calc(100vh-210px)]  p-3 mb-4 h-40 ">
      {isNotes && !isEdit && (
        <StyledTextField
          placeholder="Write your note here"
          inputText={handleInputText}
          note={note}
          onCancel={handleCancel}
          handleSave={handleSave}
          addingLoading={isSaving}
          isEditLoading={isSaving}
        />
      )}

      {noteList.length > 0 ? (
        <div className="mb-0">
          {!isNotes && !isEdit && (
            <div className="flex items-center justify-end mb-2">
              {isSaving ? (
                <CircularProgress size={18} />
              ) : (
                <span
                  className="text-sm text-[#1a73e8] cursor-pointer p-2"
                  onClick={() => setIsNotes(true)}
                >
                  + Add note
                </span>
              )}
            </div>
          )}
          {noteList.map((item: any) => (
            <NotesItem
              key={item.key} // ✅ Added key
              data={item}
              handleDelete={() => handleDelete(item.key)}
              handleEdit={() => handleEdit(item.key)}
              isEdit={isEdit}
              handleSave={handleSave}
              loadingDelete={isDeleting}
              inputText={handleInputText}
              editNoteId={editNoteId}
              onEdit={handleEditCancel}
              currentNote={note}
              addingLoading={isSaving}
              isEditLoading={isSaving}
            />
          ))}
        </div>
      ) : (
        !isNotes && !isEdit && (
          <div className="flex flex-col items-center my-auto">
            <img src={emptyimg} alt="notes" className="mx-auto w-40 h-30" />
            {isSaving ? (
              <CircularProgress size={18} />
            ) : (
              <span
                className="text-sm text-[#1a73e8] cursor-pointer p-2"
                onClick={() => setIsNotes(true)}
              >
                + Add note
              </span>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default NotesTab;
