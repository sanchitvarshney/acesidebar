import React from "react";

const TicketSubjectBar = ({ header }: any) => (
  <div className="flex items-center gap-2 mb-2">
    <span className="text-2xl">{header?.emoji || "🙂"}</span>
    <span className="font-semibold text-xl text-gray-800">
      {header?.subject || "Ticket Subject"}
    </span>
    {/* Add summary input */}
    <input
      className="ml-4 flex-1 px-3 py-1 border rounded bg-gray-50 text-sm outline-none"
      placeholder="Add summary"
    />
  </div>
);

const ThreadItem = ({ item }: any) => (
  <div
    className={`rounded mb-3 p-4 ${
      item.type === "note" ? "bg-orange-50" : "bg-white"
    } border border-gray-200`}
  >
    <div className="flex items-center gap-2 mb-1">
      <span className="font-bold text-sm text-blue-700">{item.author}</span>
      <span className="text-xs text-gray-500">{item.time}</span>
      {item.type === "note" && (
        <span className="ml-2 text-xs text-gray-500">added a private note</span>
      )}
      {item.type === "forwarded" && (
        <span className="ml-2 text-xs text-gray-500">forwarded</span>
      )}
    </div>
    <div className="text-sm text-gray-800 whitespace-pre-line">
      {item.content}
    </div>
    {item.subject && (
      <div className="mt-2 font-semibold">
        Subject: <span className="font-normal">{item.subject}</span>
      </div>
    )}
    {item.description && (
      <div className="font-semibold">
        Description: <span className="font-normal">{item.description}</span>
      </div>
    )}
  </div>
);

const ThreadList = ({ thread }: any) => (
  <div className="mb-4">
    {thread && thread.length > 0 ? (
      thread?.map((item: any, idx: number) => (
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
    <ThreadList thread={thread || []} />
    <EditorBar />
  </div>
);

export default TicketThreadSection;
