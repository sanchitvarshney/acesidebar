import React, { useState } from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from "@mui/icons-material/Edit";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import StackEditor from "../Editor";

const TicketSubjectBar = ({ header }: any) => (
  <div className="flex items-center gap-2 mb-2">
    <span className="text-2xl">
      {header?.sentiment ? JSON.parse(header.sentiment).emoji : "🙂"}
    </span>
    <span className="font-semibold text-xl text-gray-800">
      {header?.subject || "Ticket Subject"}
    </span>
    <input
      className="ml-4 flex-1 px-3 py-1 border rounded bg-gray-50 text-sm outline-none"
      placeholder="Add summary"
    />
  </div>
);

const ThreadItem = ({
  item,
  onReplyClick,
  replyText,
  onReplyTextChange,
  onSendReply,
}: any) => {
  const [open, setOpen] = useState(false);
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [localReplyText, setLocalReplyText] = useState("");
  const [markdown, setMarkdown] = useState("**Hello Stack Overflow Editor!**");
  
  const handleReplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReplyEditor(true);
  };

  const handleSendReply = () => {
    if (localReplyText.trim()) {
      onReplyClick(item, localReplyText);
      setLocalReplyText("");
      setShowReplyEditor(false);
    }
  };

  return (
    <div className="flex gap-3 mb-6">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {item.repliedBy?.avatarUrl ? (
          <img
            src={item.repliedBy.avatarUrl}
            alt={item.repliedBy.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-lg font-bold text-green-700">
            {item.repliedBy?.name?.[0] || "?"}
          </div>
        )}
      </div>
      {/* Email content */}
      <div className="flex-1">
        <div
          className="bg-orange-50 rounded shadow p-4 border border-gray-100 cursor-pointer group"
          onClick={() => setOpen((o) => !o)}
        >
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className="font-semibold text-blue-700">
                {item.repliedBy?.name || "User"}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                added a private note
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {item.repliedAt?.timestamp}
              </span>
              <div className="hidden group-hover:flex items-center bg-white rounded-full shadow border ml-2 overflow-hidden">
                <button
                  className="px-2 py-1.5 hover:bg-gray-100 focus:outline-none"
                  onClick={handleReplyClick}
                >
                  <ReplyIcon sx={{ fontSize: 18 }} />
                </button>
                <div className="w-px h-5 bg-gray-200" />
                <button className="px-2 py-1.5 hover:bg-gray-100 focus:outline-none">
                   <EditIcon sx={{ fontSize: 18 }} />
                 </button>
                 <div className="w-px h-5 bg-gray-200" />
                 <button className="px-2 py-1.5 hover:bg-gray-100 focus:outline-none">
                   <CommentIcon sx={{ fontSize: 18 }} />
                 </button>
                 <div className="w-px h-5 bg-gray-200" />
                 <button className="px-2 py-1.5 hover:bg-gray-100 focus:outline-none text-red-600">
                   <DeleteIcon sx={{ fontSize: 18 }} />
                 </button>
              </div>
            </div>
          </div>
          {open && (
            <div
              className="text-sm text-gray-800 whitespace-pre-line mb-2"
              dangerouslySetInnerHTML={{ __html: item.message }}
            />
          )}
        </div>

        {/* Inline Reply Editor */}
        {showReplyEditor && (
          <div className="mt-3 border rounded bg-white p-3 flex flex-col gap-2">
           <h2>Editor Demo</h2>
      <StackEditor initialContent={markdown} onChange={setMarkdown} />
      <h3>Markdown Output:</h3>
      <pre>{markdown}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

const ThreadList = ({ thread, onReplyClick }: any) => (
  <div>
    {thread && thread.length > 0 ? (
      thread.map((item: any, idx: number) => (
        <ThreadItem key={idx} item={item} onReplyClick={onReplyClick} />
      ))
    ) : (
      <div className="text-gray-400">No thread items.</div>
    )}
  </div>
);

const EditorBar = ({ replyText, onReplyTextChange, onSendReply }: any) => (
  <div className="border rounded bg-white p-3 flex flex-col gap-2">
    <textarea
      className="w-full min-h-[80px] border rounded p-2 text-sm"
      placeholder="Type your reply..."
      value={replyText}
      onChange={(e) => onReplyTextChange(e.target.value)}
    />
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {/* Toolbar icons placeholder */}
        <button className="text-gray-500 hover:text-blue-600">B</button>
        <button className="text-gray-500 hover:text-blue-600">I</button>
        <button className="text-gray-500 hover:text-blue-600">A</button>
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-1.5 rounded font-semibold text-sm hover:bg-blue-700"
        onClick={onSendReply}
      >
        Send
      </button>
    </div>
  </div>
);

const TicketThreadSection = ({ thread, header, onSendReply }: any) => {
  const handleReplyClick = (item: any, replyText: string) => {
    onSendReply(replyText, item);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-[600px]">
      <TicketSubjectBar header={header} />
      <ThreadList thread={thread} onReplyClick={handleReplyClick} />
    </div>
  );
};

export default TicketThreadSection;
