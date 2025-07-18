import React, { useState } from "react";

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

const ThreadItem = ({ item }: any) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="flex gap-3 mb-6 cursor-pointer"
      onClick={() => setOpen((o) => !o)}
    >
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
      <div className="flex-1 bg-white rounded shadow p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <div>
            <span className="font-semibold text-gray-800">
              {item.repliedBy?.name || "User"}
            </span>
            {item.repliedBy?.email && (
              <span className="ml-2 text-xs text-gray-500">
                {item.repliedBy.email}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400">
            {item.repliedAt?.timestamp}
          </span>
        </div>
        {open && (
          <div
            className="text-sm text-gray-800 whitespace-pre-line mb-2"
            dangerouslySetInnerHTML={{ __html: item.message }}
          />
        )}
        {/* Attachments, actions, etc. can go here */}
      </div>
    </div>
  );
};

const ThreadList = ({ thread }: any) => (
  <div>
    {thread && thread.length > 0 ? (
      thread.map((item: any, idx: number) => (
        <ThreadItem key={idx} item={item} />
      ))
    ) : (
      <div className="text-gray-400">No thread items.</div>
    )}
  </div>
);

const EditorBar = () => (
  <div className="border rounded bg-white p-3 flex flex-col gap-2">
    <textarea
      className="w-full min-h-[80px] border rounded p-2 text-sm"
      placeholder="Type your reply..."
    />
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {/* Toolbar icons placeholder */}
        <button className="text-gray-500 hover:text-blue-600">B</button>
        <button className="text-gray-500 hover:text-blue-600">I</button>
        <button className="text-gray-500 hover:text-blue-600">A</button>
      </div>
      <button className="bg-blue-600 text-white px-4 py-1.5 rounded font-semibold text-sm">
        Send
      </button>
    </div>
  </div>
);

const TicketThreadSection = ({ thread, header }: any) => (
  <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-[600px]">
    <TicketSubjectBar header={header} />
    <ThreadList thread={thread} />
    <EditorBar />
  </div>
);

export default TicketThreadSection;
