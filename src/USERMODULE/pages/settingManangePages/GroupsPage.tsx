import { Button, Typography } from "@mui/material";
import { SearchIcon } from "lucide-react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState } from "react";

function createData(name: string, agent: number) {
  return { name, agent };
}

const rows = [
  createData("billing", 0),
  createData("Ice cream sandwich", 237),
  createData("billing", 0),
  createData("Ice cream sandwich", 237),
  createData("billing", 0),
  createData("Ice cream sandwich", 237),
  createData("billing", 0),
  createData("Ice cream sandwich", 237),
  createData("billing", 0),
  createData("Ice cream sandwich", 237),
  createData("billing", 0),
  createData("Ice cream sandwich", 237),
  createData("billing", 0),
  createData("Ice cream sandwich", 237),
  createData("billing", 0),
  createData("Ice cream sandwich", 237),
];

const GroupsPage = () => {
 const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  return (
    <div className="w-full h-full grid grid-cols-[3fr_1fr] ">
      {/* left contect */}
      <div className=" max-h-[calc(100vh-100px)] overflow-y-auto p-4  space-y-2">
        <div className="flex items-center justify-between">
          <Typography variant="h6">Groups</Typography>
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

          <Button variant="contained">New Group</Button>
        </div>
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ bgcolor: "#f0f4f9" }}>
                <TableRow>
                  <TableCell sx={{ width: "600px" }}>Name</TableCell>{" "}
                  {/* Increased width */}
                  <TableCell>Active agents</TableCell>
              <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row,index) => (
                  <TableRow
                  hover
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ width: "600px" }}>{row.name}</TableCell>
                    <TableCell>{row.agent}</TableCell>
                    {hoveredRow === index && <TableCell>Edit value</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      {/* right content */}
      <div className="max-h-[calc(100vh-100px)] overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
          {/* Group Overview */}
          <section>
            <Typography variant="subtitle1" fontWeight={600}>
              Groups Overview
            </Typography>
            <Typography variant="body2">
              Groups help you organize your agents into teams like{" "}
              <strong>Support</strong> or <strong>Sales</strong>. This makes it
              easy to assign tickets, manage workflows, create specific canned
              responses, and generate group-level reports. An agent can be a
              member of multiple groups.
            </Typography>
          </section>

          {/* Business Hours */}
          <section>
            <Typography variant="subtitle1" fontWeight={600}>
              Business Hours
            </Typography>
            <Typography variant="body2">
              You can associate different business hours with each group based
              on their working schedules. For example, you can group agents by
              shifts or by location, and assign separate business hours to each
              group accordingly.
            </Typography>
          </section>

          {/* Automatic Ticket Assignment */}
          <section>
            <Typography variant="subtitle1" fontWeight={600}>
              Automatic Ticket Assignment
            </Typography>
            <Typography variant="body2" className="mb-2">
              Dispatch rules allow you to automatically route tickets to groups
              or directly to agents within them.
            </Typography>

            <Typography variant="body2" fontWeight={600}>
              To Each Group:
            </Typography>
            <Typography variant="body2" className="mb-2">
              Set up rules to automatically route tickets to the appropriate
              group.
            </Typography>

            <Typography variant="body2" fontWeight={600}>
              To Agents Within a Group:
            </Typography>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <strong>Round robin:</strong> Assign tickets to agents in a
                circular fashion.
              </li>
              <li>
                <strong>Load balanced:</strong> Limit the number of tickets per
                agent.
              </li>
              <li>
                <strong>Skill based:</strong> Assign tickets based on agent
                expertise.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;
