import { Button } from "@mui/material";
import React, { useState } from "react";

const AccordionPanel = ({ title, children }: any) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-2 border rounded bg-white">
  <Button
  fullWidth
  onClick={() => setOpen((o) => !o)}
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    px: 2, // Equivalent to px-4
    py: 1, // Equivalent to py-2
    fontSize: "0.875rem", // text-sm
    fontWeight: 600,
    color: "#374151", // Tailwind text-gray-700
    textTransform: "none", // Prevent uppercase transformation
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "#f9fafb", // Tailwind hover:bg-gray-50
    },
  }}
>
  <span>{title}</span>
  <span>{open ? "-" : "+"}</span>
</Button>
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
