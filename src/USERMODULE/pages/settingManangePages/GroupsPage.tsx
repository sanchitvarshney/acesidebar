import {
  Button,
  CircularProgress,
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

import { useLazyGetDepartmentListQuery } from "../../../services/agentServices";


const GroupsPage = () => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [getDepartmentList, { data: departmentList,isLoading: isGetDepartmentListLoading }] =
    useLazyGetDepartmentListQuery();

  useEffect(() => {
    getDepartmentList();
  }, []);
  
  console.log("departmentList", departmentList);

  return (
    <div className="w-full h-[calc(100vh-100px)]  grid grid-cols-[3fr_1fr] ">
      {/* left contect */}
      <div className="  p-4  space-y-2">
        <div className="flex items-center justify-between">
          <Typography variant="h6">Departments</Typography>
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

          <Button variant="contained" color="primary">
            New Department
          </Button>
        </div>
        <div>
          <TableContainer
            component={Paper}
            sx={{ maxHeight: "calc(100vh - 170px)", minHeight: "calc(100vh - 170px)" }}
          >
            <Table stickyHeader sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: "#f0f4f9" }}>
                <TableRow>
                  <TableCell sx={{ width: "70%" }}>Name</TableCell>
                  <TableCell sx={{ width: "20%" }}>Active agents</TableCell>
                  <TableCell sx={{ width: "10%" }} />
                </TableRow>
              </TableHead>

              <TableBody>
                {isGetDepartmentListLoading ? (
                  // 🔄 Loading State
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <CircularProgress size={20}  />
                    </TableCell>
                  </TableRow>
                ) : departmentList?.length === 0 ? (
                  // ❌ Empty State
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="body2" color="textSecondary">
                        No departments found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (

                  // ✅ Data Rows
                  departmentList?.map((row:any) => (
                    <TableRow
                      hover
                      onMouseEnter={() => setHoveredRow(row?.key)}
                      onMouseLeave={() => setHoveredRow(null)}
                      key={row.key}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell sx={{ width: "70%" }}>{row.departmentName}</TableCell>
                      <TableCell sx={{ width: "20%" }}>{row.manager}</TableCell>
                      <TableCell sx={{ width: "10%" }}>
                        {hoveredRow === row.key ? (
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
                            <ToggleButton
                              value="delete"
                              aria-label="delete"
                              size="small"
                            >
                              <DeleteIcon fontSize="small" color="error" />
                            </ToggleButton>
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
          {/* Department Overview */}
          <section>
            <Typography variant="subtitle1" fontWeight={600}>
              Department Overview
            </Typography>
            <Typography variant="body2">
              Departments help you organize agents based on functions such as{" "}
              <strong>Billing</strong>, <strong>Support</strong>, or{" "}
              <strong>Sales</strong>. This makes it easier to assign tickets,
              manage workflows, and generate department-level reports. An agent
              can be part of one or more departments depending on their role.
            </Typography>
          </section>

          {/* Business Hours */}
          <section>
            <Typography variant="subtitle1" fontWeight={600}>
              Business Hours
            </Typography>
            <Typography variant="body2">
              You can associate different business hours with each department
              based on their schedules. For example, you can set distinct hours
              for <strong>Billing</strong> and <strong>Support</strong>,
              depending on availability across time zones or shifts.
            </Typography>
          </section>

          {/* Automatic Ticket Assignment */}
          <section>
            <Typography variant="subtitle1" fontWeight={600}>
              Automatic Ticket Assignment
            </Typography>
            <Typography variant="body2" className="mb-2">
              Dispatch rules allow you to automatically route tickets to
              departments or directly to agents within them.
            </Typography>

            <Typography variant="body2" fontWeight={600}>
              To Each Department:
            </Typography>
            <Typography variant="body2" className="mb-2">
              Set up rules to automatically route tickets to the right
              department.
            </Typography>

            <Typography variant="body2" fontWeight={600}>
              To Agents Within a Department:
            </Typography>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <strong>Round robin:</strong> Assign tickets to agents in a
                circular fashion.
              </li>
              <li>
                <strong>Load balanced:</strong> Limit the number of tickets per
                agent to balance workload.
              </li>
              <li>
                <strong>Skill based:</strong> Assign tickets based on agent
                expertise within the department.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;
