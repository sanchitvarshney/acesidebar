import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import AutomationRuleCard, {
  AutomationRule,
} from "../../../components/AutomationRuleCard";

const rulesData: AutomationRule[] = [
  {
    id: "rule-1",
    index: 1,
    title: "Send payments to Billing - Sample Dispatcher rule",
    description: "If Subject contains payment Assign to Group Billing",
    lastModified: "3 months ago",
    by: "--",
    impactedTickets: "--",
    enabled: true,
  },
  {
    id: "rule-2",
    index: 2,
    title: "Auto-assign high priority tickets",
    description: "If Priority is High assign to On-Call Team",
    lastModified: "2 months ago",
    by: "Admin",
    impactedTickets: "12",
    enabled: true,
  },
  {
    id: "rule-3",
    index: 3,
    title: "Tag refund requests",
    description: 'If Subject contains refund add tag "refund"',
    lastModified: "5 days ago",
    by: "Ops",
    impactedTickets: "4",
    enabled: false,
  },
];
const selecetFieldJsonData = [
  {
    value: "1",
    title: "Execute the first matching rule",
    subTitle: "only execute the first matching rule will be executed",
  },
  {
    value: "2",
    title: "Execute all matching rules",
    subTitle:
      "All matching rules will be executed sequentially, one after the other, in the order in which they are configured.",
  },
];

const TicketCreationAutomation: React.FC = () => {
  const [selectFieldValue, setSelectFieldValue] = useState("");
  const handleToggle = (id: string, enabled: boolean) => {
    console.log("toggle", id, enabled);
  };

  const handleChange = (event: any) => {
    setSelectFieldValue(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 0 }}>
      <Typography variant="body1" >
        {" "}
        these rules automate next steps as soon as a customer writes to you. For
        example, set the priority based on urgency, assign it to the right
        group, etc. The rules run sequentially.
      </Typography>
      <Stack direction="row" justifyContent={"space-between"} alignItems="center" spacing={2} my={2}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 280 }}>
         
          <Select
    
            value={selectFieldValue}
            onChange={handleChange}
            // label="Age"
            sx={{ maxWidth: 280 }}
            MenuProps={{
              PaperProps: {
                sx: { width: 280, maxWidth: 280 },
              },
            }}
            renderValue={(value) => {
              const option = selecetFieldJsonData.find((o) => o.value === value);
              return option ? option.title : '';
            }}
          >
            {selecetFieldJsonData.map((item) => (
              <MenuItem
                value={item.value}
                key={`${item.value}-${item.title}`}
                sx={{ alignItems: "flex-start" }}
              >
                <Box sx={{ maxWidth: "100%" }}>
                  <Typography variant="body2" sx={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", whiteSpace: "normal", overflowWrap: "anywhere" }}>
                    {item.subTitle}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained">New rule</Button>
      </Stack>
      <Stack spacing={2}>
        {rulesData.map((rule) => (
          <AutomationRuleCard
            key={rule.id}
            rule={rule}
            onToggle={handleToggle}
          />
        ))}
      </Stack>
    </Container>
  );
};

export default TicketCreationAutomation;
