import { Alert, Typography } from "@mui/material";
import React from "react";

const MergeConfirmation = () => {
  return (
    <div className="w-full">
      <Alert severity="warning" sx={{ alignItems: "flex-start" }}>
        <Typography variant="subtitle1" fontWeight={600} >
          Important
        </Typography>
        <Typography variant="body2" paragraph>
          Merging will move all tickets, notes and contact information from the
          secondary contact into <strong>Emily Garcia</strong>. The secondary
          contact will be deleted and <strong>cannot be restored</strong>. This
          operation cannot be undone.
        </Typography>
        <Typography variant="body2">
          Please review the information you'd like to associate with the primary
          contact, <strong>Emily Garcia</strong>. You can have a maximum of{" "}
          <strong>10 emails</strong>, <strong>20 companies</strong>, one{" "}
          <strong>work</strong> and <strong>mobile phone</strong> saved to this
          contact.
        </Typography>
      </Alert>
    </div>
  );
};

export default MergeConfirmation;
