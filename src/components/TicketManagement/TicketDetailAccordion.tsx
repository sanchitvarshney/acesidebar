import React, { useState } from "react";

const AccordionPanel = ({ title, children }: any) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-2 border rounded bg-white">
      <button
        className="w-full flex justify-between items-center px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        onClick={() => setOpen((o) => !o)}
      >
        <span>{title}</span>
        <span>{open ? "-" : "+"}</span>
      </button>
      {open && (
        <div className="px-4 py-2 border-t text-xs text-gray-600">
          {children}
        </div>
      )}
    </div>
  );
};

const TicketDetailAccordion = ({ ticket }: any) => (
  <div className="p-4">
    <AccordionPanel title="Activities">
      {/* Activities content here */}
      No activities yet.
    </AccordionPanel>
    <AccordionPanel title="Logs">
      {/* Logs content here */}
      No logs yet.
    </AccordionPanel>
  </div>
);

export default TicketDetailAccordion;
