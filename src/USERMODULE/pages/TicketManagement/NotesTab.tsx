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
  const [triggerAddNote, { isLoading: addingLoading }] = useCommanApiMutation();
  const [triggerdeleteNote, { isLoading: isDeletingNote }] =
    useCommanApiMutation();
  const [triggerEditNote, { isLoading: isEditLoading, error }] =
    useCommanApiMutation();

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
        triggerEditNote(payloadUpdate).then((res) => {
          if (res?.data?.type === "error") {
            showToast(res?.data?.message || "An error occurred", "error");
            return;
          }
          setNoteList((prev) =>
            prev.map((item) =>
              item.key === editNoteId ? { ...item, note } : item
            )
          );

          setEditNoteId(null);
          setIsEdit(false);
        });
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
          if (res?.data?.type === "error") {
            showToast(res?.data?.message || "An error occurred", "error");
            return;
          }

          setNoteList((prev) => [res?.data?.data, ...prev]);
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
      if (res?.data?.type === true) {
        showToast(res?.data?.message || "An error occurred", "error");
        return;
      }
      setNoteList((prev) => prev.filter((item) => item.key !== id));
    });
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

  useEffect(() => {
    if (error) {
      //@ts-ignore
      showToast(error?.data?.message || "An error occurred", "error");
      return;
    }
  }, [error]);

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

      {noteList.length > 0 ? (
        <div className="mb-0">
          {!isNotes && (
            <div className="flex items-center justify-end mb-2">
              {addingLoading || isEditLoading ? (
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
              loadingDelete={isDeletingNote}
              inputText={handleInputText}
              editNoteId={editNoteId}
              onEdit={handleEditCancel}
              currentNote={note}
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
