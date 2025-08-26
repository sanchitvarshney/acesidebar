import {
  Alert,
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { SearchIcon, Table } from "lucide-react";
import React, { useState } from "react";

type OptionType = {
  label: string;
  value: string | number;
};
const options: OptionType[] = [
  { label: "Ten", value: 10 },
  { label: "Twenty", value: 20 },
  { label: "Thirty", value: 30 },
  { label: "Forty", value: 40 },
  { label: "Fifty", value: 50 },
];
const rows: any = [];
const AccountDayPasses = () => {
  const [selectedOptions, setSelectedOptions] =
    React.useState<OptionType | null>(null);
  const [timePeriod, setTimePeriod] = useState("");
  return (
    <div className="w-full h-full grid grid-cols-[3fr_1fr] ">
      {/* left contect */}
      <div className=" min-h-[calc(100vh-100px)] max-h-[calc(100vh-100px)] overflow-y-auto p-4  space-y-6 border-r border-gray-200">
        <div className="space-y-4">
          <Typography variant="h6">Day Pass</Typography>
          <Alert severity="error">
            Day Passes are not available on the Free plan. Please upgrade to
            purchase.
          </Alert>
        </div>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Usage History</Typography>

          <div className="flex items-center gap-4">
            <div className="">
              <Typography variant="subtitle1">Time period</Typography>
              <FormControl sx={{ width: "200px" }} size="small">
                <Select
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="">
              <Typography variant="subtitle1">filter</Typography>
              <Autocomplete
                size="small"
                options={options}
                getOptionLabel={(option) => option.label}
                value={selectedOptions}
                onChange={(_, newValue) => setSelectedOptions(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search..."
                    sx={{ width: "200px" }}
                  />
                )}
                isOptionEqualToValue={(option, value) =>
                  option.value === value?.value
                }
              />
            </div>
          </div>
        </Box>

        <TableContainer component={Paper}>
          {rows.length > 0 ? (
            <Table aria-label="simple table">
              <TableHead sx={{ bgcolor: "#f0f4f9" }}>
                <TableRow>
                  <TableCell sx={{ width: "600px" }}>Name</TableCell>{" "}
                  {/* Increased width */}
                  <TableCell>Active agents</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: any) => (
                  <TableRow
                    hover
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ width: "600px" }}>{row.name}</TableCell>
                    <TableCell>{row.agent}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography variant="body2" sx={{ textAlign: "center", py: 3 }}>
              No results found for selected options.
            </Typography>
          )}
        </TableContainer>
      </div>

      {/* right content */}
      <div className="max-h-[calc(100vh-100px)] overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
          {/* Group Overview */}
          <section>
            <Typography variant="subtitle1" fontWeight={600}>
              Day Pass
            </Typography>
            <Typography variant="body2">
              A Day Pass is used up for each day an occasional agent logs in to
              your helpdesk. You can purchase Day Passes in multiples of 5 at a
              time, and even setup Freshdesk to automatically renew your Day
              Passes when they get used up.
            </Typography>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AccountDayPasses;
