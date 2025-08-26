import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { primarylanguageData, timeZoneData } from "../../../data/setting";

import HelpIcon from "@mui/icons-material/Help";
import { AnimatePresence, motion } from "framer-motion";

const AccountHelpCenter = () => {
  const [primaryLanguage, setPrimaryLanguage] = useState(
    primarylanguageData[0].value
  );
  const [timeZone, setTimeZone] = useState(timeZoneData[0].value);

  const [showMessage, setShowMessage] = useState(false);
  const [dateFormat, setDateFormat] = useState("day-month-year");
  const [conversations, setConversations] = useState("newest");

  const [dateFormatValue, setDateFormatValue] = useState();

  const changeFormatOfDate = (dateFormat: string) => {
    const today = new Date();

    const weekday = today.toLocaleDateString("en-US", { weekday: "short" }); // Tue
    const day = today.getDate().toString().padStart(2, "0"); // 26
    const month = today.toLocaleDateString("en-US", { month: "short" }); // Aug
    const year = today.getFullYear(); // 2025

    if (dateFormat === "day-month-year") {
      return `${weekday}, ${day} ${month} ${year}`;
    }

    if (dateFormat === "month-day-year") {
      return `${weekday}, ${month} ${day}, ${year}`;
    }

    return `${weekday}, ${month} ${day}, ${year}`; // default fallback
  };

  useEffect(() => {
    const dateValue: any = changeFormatOfDate(dateFormat);
    setDateFormatValue(dateValue);
  }, [dateFormat]);

  return (
    <div className="w-full h-full grid grid-cols-[3fr_1fr] ">
      {/* left contect */}
      <div className=" min-h-[calc(100vh-100px)] max-h-[calc(100vh-100px)] overflow-y-auto p-4  space-y-6 border-r border-gray-200">
        <Typography variant="h6">Helpdesk</Typography>
        {/* form */}
        <div className="space-y-5">
          {/* Helpdesk Name field */}
          <div className="flex justify-between">
            <Typography
              variant="subtitle2"
              sx={{ width: { xs: "100%", md: "300px" } }}
            >
              Helpdesk Name
            </Typography>
            <div className="w-full">
              <TextField
                size="small"
                variant="outlined"
                sx={{ width: { xs: "100%", md: "400px" } }}
              />
              <p className="text-xs text-gray-500 mt-2">
                This will be the help desk name that is shown in the header and
                mail notifications.
              </p>
            </div>
          </div>
          {/* Helpdesk URL field */}
          <div className="flex justify-between">
            <Typography
              variant="subtitle2"
              sx={{ width: { xs: "100%", md: "300px" } }}
            >
              Helpdesk URL
            </Typography>
            <div className="w-full flex items-center gap-3">
              <Typography variant="subtitle2">test@gmail.com</Typography>
              <Button size="small" variant="contained">
                Edit
              </Button>
            </div>
          </div>{" "}
          {/* Primary Language field */}
          <div className="flex justify-between">
            <Typography
              variant="subtitle2"
              sx={{ width: { xs: "100%", md: "300px" } }}
            >
              Primary Language
            </Typography>
            <div className="w-full space-x-2">
              <FormControl sx={{ width: "200px" }} size="small">
                <Select
                  defaultValue={primaryLanguage}
                  value={primaryLanguage}
                  onChange={(e) => setPrimaryLanguage(e.target.value)}
                >
                  {primarylanguageData.map((item) => (
                    <MenuItem value={item.value}>{item.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <IconButton
                size="small"
                onClick={() => setShowMessage(!showMessage)}
              >
                <HelpIcon />
              </IconButton>

              <AnimatePresence>
                {showMessage && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -10 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -10 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{ marginTop: "10px" }}
                  >
                    <Alert
                      icon={false}
                      severity="warning"
                      sx={{ border: "2px solid #ffefc1ff" }}
                    >
                      We are working on supporting other languages in the Mint
                      experience.
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {/* Date Format field */}
          <div className="flex justify-between">
            <Typography
              variant="subtitle2"
              sx={{ width: { xs: "100%", md: "300px" } }}
            >
              Date Format
            </Typography>
            <div className="w-full flex items-center gap-3">
              <FormControl sx={{ width: "200px" }} size="small">
                <Select
                  defaultValue={dateFormat}
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                >
                  <MenuItem value={"day-month-year"}>DAY-MONTH-YEAR</MenuItem>
                  <MenuItem value={"month-day-year"}>MONTH-DAY-YEAR</MenuItem>
                </Select>
              </FormControl>
              <p className="text-md text-gray-500 ">{dateFormatValue}</p>
            </div>
          </div>
          {/* Time zone field */}
          <div className="flex justify-between">
            <Typography
              variant="subtitle2"
              sx={{ width: { xs: "100%", md: "300px" } }}
            >
              Time zone
            </Typography>
            <div className="w-full ">
              <FormControl sx={{ width: "320px" }} size="small">
                <Select
                  defaultValue={timeZone}
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                >
                  {timeZoneData.map((item) => (
                    <MenuItem value={item.value}>{item.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          {/* Next ticket field */}
          <div className="flex justify-between">
            <Typography
              variant="subtitle2"
              sx={{ width: { xs: "100%", md: "300px" } }}
            >
              Next Ticket ID #
            </Typography>
            <div className="w-full">
              <TextField
                size="small"
                variant="outlined"
                sx={{ width: { xs: "100%", md: "200px" } }}
              />
              <p className="text-xs text-gray-500 mt-2">
                The next ticket ID counter will start with this number (Should
                be greater than the last ticket ID created). This affects
                tickets created henceforth.
              </p>
            </div>
          </div>
          {/* sort conversation field*/}
          <div className="flex justify-between">
            <Typography
              variant="subtitle2"
              sx={{ width: { xs: "100%", md: "300px" } }}
            >
              Sort conversations
            </Typography>
            <div className="w-full">
              <FormControl sx={{ width: "200px" }} size="small">
                <Select
                  defaultValue={conversations}
                  value={conversations}
                  onChange={(e) => setConversations(e.target.value)}
                >
                  <MenuItem value={"newest"}>Show newest on top</MenuItem>
                  <MenuItem value={"oldest"}>Show oldest on top</MenuItem>
                </Select>
              </FormControl>
              <p className="text-xs text-gray-500 mt-2">
                This is the order in which messages will appear in tickets.
              </p>
            </div>
          </div>
          {/* ticket view layout field */}
          <div className="flex justify-between">
            <Typography
              variant="subtitle2"
              sx={{ width: { xs: "100%", md: "300px" } }}
            >
              Ticket view layout
            </Typography>
            <div className="w-full">
              <FormControl sx={{ width: "200px" }} size="small">
                <Select
                  defaultValue={conversations}
                  value={conversations}
                  onChange={(e) => setConversations(e.target.value)}
                >
                  <MenuItem value={"newest"}>Allow agents to choose</MenuItem>
                  <MenuItem value={"oldest"}>Show oldest on top</MenuItem>
                  <MenuItem value={"newest"}>Show newest on top</MenuItem>
                  <MenuItem value={"oldest"}>Show oldest on top</MenuItem>
                </Select>
              </FormControl>
              <p className="text-xs text-gray-500 mt-2">
                This is the order in which messages will appear in tickets.
              </p>
            </div>
          </div>
          {/*  */}
        </div>
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

export default AccountHelpCenter;
