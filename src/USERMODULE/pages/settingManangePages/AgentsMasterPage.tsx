import {
  Box,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { SearchIcon } from "lucide-react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  useLazyGetAgentListQuery,
  useLazyGetDepartmentListQuery,
} from "../../../services/agentServices";

const AgentsMasterPage = () => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [getAgentList, { data: agentList, isLoading: agentListLoading }] =
    useLazyGetAgentListQuery();

  useEffect(() => {
    getAgentList();
  }, []);

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full h-[calc(100vh-100px)]  grid grid-cols-[3fr_1fr] ">
      {/* left contect */}
      <div className="  p-4  space-y-2">
        <div className="flex items-center justify-between">
          <Typography variant="h6">Agents</Typography>
          <div>
            <div
              className={` transition-all duration-200 ml-30 w-[340px] relative`}
            >
              <div className="flex items-center w-full bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm transition-shadow focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)] ">
                <SearchIcon className="text-gray-500 mr-3" />
                <input
                  type="text"
                  placeholder="Search…"
                  className="flex-1 bg-transparent outline-none text-gray-800 text-[15px] leading-tight placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="contained" color="primary">
              New agent
            </Button>

            <Button variant="contained" color="primary">
              Export
            </Button>
          </div>
        </div>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_: any, newValue: any) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              "& .MuiTabs-flexContainer": {
                display: "flex",
                gap: 2,
                alignItems: "center",
              },
              "& .MuiTab-root": {
                // minHeight: 40,
                color: "#6b7280",
                "&.Mui-selected": {
                  color: "#1a73e8",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#1a73e8",
                // height: 2,
              },
            }}
          >
            <Tab
              id={"support"}
              aria-controls={`support-panel`}
              aria-label={"support"}
              label={`Support Agents (${0})`}
            />
            <Tab
              id={"deactivated"}
              aria-controls={`deactivated-panel`}
              aria-label={"deactivated"}
              label={`Deactivated Agents (${0})`}
            />
          </Tabs>
        </Box>
        <div>
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: "calc(100vh - 220px)",
              minHeight: "calc(100vh - 220px)",
            }}
          >
            <Table stickyHeader sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: "#f0f4f9" }}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Last Seen</TableCell>
                  <TableCell sx={{ width: "10%" }} />
                </TableRow>
              </TableHead>

              <TableBody>
                {agentListLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <CircularProgress size={20} />
                    </TableCell>
                  </TableRow>
                ) : agentList?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="body2" color="textSecondary">
                        No Agents found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  // ✅ Data Rows
                  agentList?.map((row: any) => (
                    <TableRow
                      hover
                      onMouseEnter={() => setHoveredRow(row?.email)}
                      onMouseLeave={() => setHoveredRow(null)}
                      key={row.key}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{row.firstName + " " + row.lastName}</TableCell>
                      <TableCell>{row.roleType}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{"--"}</TableCell>
                      <TableCell align="right" sx={{ width: "10%" }}>
                        {hoveredRow === row.email ? (
                          <ToggleButtonGroup
                            value={""}
                            onChange={() => {}}
                            aria-label="action"
                            size="small"
                          >
                            <ToggleButton
                              value="edit"
                              aria-label="edit"
                              size="small"
                            >
                              <EditIcon fontSize="small" />
                            </ToggleButton>
                            {/* <ToggleButton
                              value="delete"
                              aria-label="delete"
                              size="small"
                            >
                              <DeleteIcon fontSize="small" color="error" />
                            </ToggleButton> */}
                          </ToggleButtonGroup>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      {/* right content */}
      <div className="max-h-[calc(100vh-100px)] overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
          {/* Agent Overview */}
          <section>
            <Typography variant="subtitle1" fontWeight={600}>
              Agent Overview
            </Typography>
            <Typography variant="body2">
              Agents are the individuals who handle customer queries, resolve
              tickets, and ensure smooth support operations. You can define
              their <strong>roles</strong>, <strong>permissions</strong>, and{" "}
              <strong>availability</strong> to match your organization’s needs.
            </Typography>
          </section>

          {/* Working Hours */}
          <section>
            <Typography variant="subtitle1" fontWeight={600}>
              Working Hours
            </Typography>
            <Typography variant="body2">
              Each agent can have personalized working hours. For example,
              agents in different <strong>time zones</strong> or{" "}
              <strong>shifts</strong> can be assigned custom schedules to ensure
              round-the-clock support coverage.
            </Typography>
          </section>

          {/* Ticket Assignment */}
          <section>
            <Typography variant="subtitle1" fontWeight={600}>
              Ticket Assignment
            </Typography>
            <Typography variant="body2" className="mb-2">
              Tickets can be assigned directly to agents based on workload,
              specialization, or availability.
            </Typography>

            <Typography variant="body2" fontWeight={600}>
              Assignment Methods:
            </Typography>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <strong>Round robin:</strong> Distribute tickets evenly among
                available agents.
              </li>
              <li>
                <strong>Load balanced:</strong> Prevent overloading by limiting
                ticket assignments per agent.
              </li>
              <li>
                <strong>Skill based:</strong> Route tickets to agents with the
                right expertise for faster resolution.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AgentsMasterPage;
