import React from "react";

const PropertyField = ({ label, value, color }: any) => (
  <div className="flex items-center mb-2">
    <span className="text-xs text-gray-500 min-w-[70px]">{label}:</span>
    {color ? (
      <span
        className="ml-2 px-2 py-0.5 rounded text-xs font-semibold"
        style={{ background: color, color: "#fff" }}
      >
        {value}
      </span>
    ) : (
      <span className="ml-2 text-xs text-gray-700">{value}</span>
    )}
  </div>
);

const ContactCard = ({ name, email }: any) => (
  <div className="flex items-center gap-3 p-3 bg-white rounded shadow mb-3">
    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-lg font-bold text-pink-600">
      {name?.[0] || "?"}
    </div>
    <div>
      <div className="font-semibold text-sm text-gray-800">{name}</div>
      <div className="text-xs text-gray-500">{email}</div>
      <button className="text-xs text-blue-600 hover:underline mt-1">
        View more info
      </button>
    </div>
  </div>
);

const RecentTickets = () => (
  <div className="mb-3">
    <div className="text-xs font-semibold text-gray-600 mb-1">
      RECENT TICKETS
    </div>
    <div className="bg-white rounded shadow p-2">
      <div className="text-xs text-gray-800">TEST MAIL #4</div>
      <div className="text-xs text-gray-500">Status: Open</div>
    </div>
  </div>
);

const TimeLogs = () => (
  <div className="mb-3">
    <div className="text-xs font-semibold text-gray-600 mb-1">TIME LOGS</div>
    <button className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100">
      Log time
    </button>
  </div>
);

const TicketPropertiesSidebar = ({ ticket }: any) => (
  <aside className="w-80 min-w-[300px] border-l bg-gray-50 flex flex-col h-full p-4">
    <div className="text-xs font-bold text-gray-700 mb-3">PROPERTIES</div>
    <PropertyField
      label="Priority"
      value={ticket?.priority?.name || "Low"}
      color={ticket?.priority?.color || "#8bc34a"}
    />
    <PropertyField label="Group" value={ticket?.group || "Customer Success"} />
    <PropertyField label="Agent" value={ticket?.agent || "--"} />
    <PropertyField label="Product" value={ticket?.product || "Example"} />
    <div className="my-4 border-b" />
    <ContactCard
      name={ticket?.requester || "Developer Account"}
      email={ticket?.email || "postmanreply@gmail.com"}
    />
    <RecentTickets />
    <TimeLogs />
  </aside>
);

export default TicketPropertiesSidebar;
