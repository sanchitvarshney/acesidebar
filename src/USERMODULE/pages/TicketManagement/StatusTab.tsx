import {
  Autocomplete,
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  useGetPriorityListQuery,
  useGetStatusListQuery,
  useGetTagListQuery,
  useGetTypeListQuery,
} from "../../../services/ticketAuth";
import {
  useLazyGetAgentsBySeachQuery,
  useLazyGetDepartmentBySeachQuery,
} from "../../../services/agentServices";
import { useToast } from "../../../hooks/useToast";
import { useCommanApiMutation } from "../../../services/threadsApi";
import { set } from "react-hook-form";
import SingleValueAsynAutocomplete from "../../../components/reusable/SingleValueAsynAutocomplete";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const SLAOptions = [
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hours" },
  { value: "8h", label: "8 Hours" },
  { value: "24h", label: "1 Day" },
  { value: "48h", label: "2 Days" },
  { value: "72h", label: "3 Days" },
  { value: "1w", label: "1 Week" },
  { value: "2w", label: "2 Weeks" },
  { value: "1m", label: "1 Month" },
];

const StatusTab = ({ ticket }: any) => {
  const { showToast } = useToast();
  const [tagValue, setTagValue] = useState<any[]>([]);
  const [changeTagValue, setChangeTabValue] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");
  const [sla, setSLA] = useState("");
  const [status, setStatus] = useState<any>("");
  const [dept, setDept] = useState<any>("");
  const [agent, setAgent] = useState<any>("");
  const [options, setOptions] = useState<any>([]);
  const [dueDate, setDueDate] = useState<any>("");
  const [isUpdate, setIsUpdate] = useState(0);
  const { data: tagList } = useGetTagListQuery();
  const { data: priorityList } = useGetPriorityListQuery();
  const { data: statusList } = useGetStatusListQuery();
  const { data: typeList } = useGetTypeListQuery();
  const [triggerDept, { isLoading: deptLoading }] =
    useLazyGetDepartmentBySeachQuery();
  const [triggerSeachAgent, { isLoading: seachAgentLoading }] =
    useLazyGetAgentsBySeachQuery();
  const [triggerStatus, { isLoading: statusLoading }] = useCommanApiMutation();
  const displayOptions = changeTagValue.length >= 3 ? options : [];

  // update status handler

  const handleUpdateTicket = () => {
    const payload = {
      url: "edit-properties/" + ticket?.ticketId,
      method: "PUT",
      body: {
        ticket: ticket?.ticketId,

        type: type,
        priority: priority,
        status: status,
        tags: tagValue.map((tag: any) => tag?.tagID),
        department: `${dept.deptId}`,
        agent: agent.agentID,
      },
    };

    triggerStatus(payload)
      .unwrap()
      .then((res) => {
        if (!res?.success) {
          showToast(res?.message || res?.error?.message, "error");
          setIsUpdate((prev) => prev + 1);
          return;
        }
        if (res?.success) {
          showToast(res?.message || res?.error?.message, "success");
        }
      })
      .catch((err) => {
        showToast(err?.data?.message, "error");
        setIsUpdate((prev) => prev + 1);
      });
  };

  useEffect(() => {
    if (ticket) {
      if (ticket.tags) {
        setTagValue((prev) => [...prev, ...ticket.tags]);
      }

      if (ticket.status) {
        setStatus(ticket.status.key);
      }

      if (ticket.priority) {
        const key = ticket.priority.key;
        setPriority(key);
      }

      if (ticket.type) {
        setType(ticket.type.key);
      }

      if (ticket.deptName) {
        const department = {
          deptId: ticket?.deptName?.key,
          deptName: ticket?.deptName?.name,
        };
        setDept(department);
      }

      if (ticket.email && ticket.username && ticket.userID) {
        const agent = {
          agentId: ticket.userID,
          fName: ticket.username,
          emailAddress: ticket.email,
        };

        setAgent(agent);
      }
    }
  }, [ticket, isUpdate]);

  const fetchOptions = (value: string) => {
    if (!value || value.length < 3) return [];
    const filteredOptions = tagList?.filter((option: any) =>
      option.tagName?.toLowerCase().includes(value?.toLowerCase())
    );
    return filteredOptions || [];
  };

  useEffect(() => {
    if (changeTagValue.length >= 3) {
      const filterValue: any = fetchOptions(changeTagValue);
      setOptions(filterValue);
    } else {
      setOptions([]);
    }
  }, [changeTagValue, tagList]);

  const handleSelectedOption = (_: any, newValue: any, type: string) => {
    if (type === "tag") {
      if (!Array.isArray(newValue) || newValue.length === 0) {
        showToast("Tag already exists", "error");
        return;
      }

      setTagValue((prev) => {
        // Find newly added tags (those not already in prev)
        const addedTags = newValue.filter(
          (tag: any) => !prev.some((p) => p.tagID === tag.tagID)
        );

        if (addedTags.length === 0) {
          // No new tags (all duplicates)
          showToast("Tag already exists", "error");
          return prev;
        }

        return [...prev, ...addedTags];
      });
    }
  };

  return (
    <div className="w-full h-[calc(100vh-100px)] overflow-hidden bg-[#f0f5fd]">
      <div className="w-full min-h-[calc(100vh-265px)] max-h-[calc(100vh-255px)] overflow-y-auto">
        <div className="w-full space-y-3 p-2 sm:p-3">
          <Typography variant="subtitle1">Properties</Typography>

          <div>
            <Typography variant="subtitle1" sx={{ fontSize: { xs: "11px", sm: "12px" }, mb: 0.5 }}>
              Type
            </Typography>
            <Select
              variant="standard"
              fullWidth
              size="medium"
              value={type}
              onChange={(e) => setType(e.target.value)}
              sx={{
                fontSize: { xs: "14px", sm: "16px" },
                "& .MuiSelect-select": {
                  padding: { xs: "8px 0", sm: "12px 0" },
                },
              }}
            >
              {[...((typeList as any[]) || [])].map((name: any) => (
                <MenuItem key={name.key} value={name.key}>
                  {name.typeName}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <Typography variant="subtitle1" sx={{ fontSize: "12px" }}>
              Status
            </Typography>
            <Select
              fullWidth
              variant="standard"
              size="medium"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusList?.map((status: any) => (
                <MenuItem key={status.key} value={status.key}>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    {status?.statusName}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </div>

          <div>
            <Typography variant="subtitle1" sx={{ fontSize: "12px" }}>
              Priority
            </Typography>
            <Select
              fullWidth
              variant="standard"
              size="medium"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              {[...((priorityList as any[]) || [])].map((priority: any) => (
                <MenuItem key={priority.key} value={priority.key}>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <span
                      className="w-3 h-3 inline-block"
                      style={{ backgroundColor: priority.color || "#cccccc" }}
                    />
                    {priority.specification}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <Typography variant="subtitle1" sx={{ fontSize: "12px" }}>
              SLA
            </Typography>
            <Select
              fullWidth
              variant="standard"
              size="medium"
              value={sla}
              onChange={(e) => setSLA(e.target.value)}
            >
              {(SLAOptions || []).map((sla: any) => (
                <MenuItem key={sla.value} value={sla.value}>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    {sla.label}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <Typography variant="subtitle1" sx={{ fontSize: { xs: "11px", sm: "12px" }, mb: 0.5 }}>
              Due Date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                value={dueDate || null}
                onChange={(newValue: any) => {
                  // Validate that the selected time is not in the past
                  if (newValue && newValue.isBefore(dayjs())) {
                    return; // Don't update if past time is selected
                  }
                  setDueDate(newValue);
                }}
                minDateTime={dayjs()}
                maxDateTime={dayjs().add(7, 'day')}
                shouldDisableDate={(date) => {
                  // Disable dates before today and after 7 days from today
                  return date.isBefore(dayjs(), "day") || date.isAfter(dayjs().add(7, 'day'), "day");
                }}
                shouldDisableTime={(value, view) => {
                  const now = dayjs();
                  const selectedDate = dayjs(value);
                  
                  if (view === 'minutes') {
                    // Only disable past minutes for current hour on today
                    if (selectedDate.isSame(now, 'day') && selectedDate.isSame(now, 'hour')) {
                      return value.minute() < now.minute();
                    }
                  }
                  
                  return false;
                }}
                openTo="day"
                views={['year', 'month', 'day', 'hours', 'minutes']}
                timeSteps={{ hours: 1, minutes: 15 }}
                slotProps={{
                   textField: {
                     variant: "standard",
                     fullWidth: true,
                     size: "small",
                     name: "Due Date",
                     placeholder: "DD/MM/YYYY HH:mm",                     
                     InputProps: {
                       sx: {
                         "&:before": {
                           borderBottom: "none !important", // normal state
                         },
                         "&:hover:before": {
                           borderBottom: "none !important", // hover state
                         },
                         "&:after": {
                           borderBottom: "none !important", // focused state
                         },
                         "&.Mui-focused:after": {
                           borderBottom: "none !important", // focused state
                         },
                         "&.Mui-focused:before": {
                           borderBottom: "none !important", // focused state
                         },
                         "& .MuiInputBase-input": {
                           fontSize: "10px !important",
                           padding: "8px 0 !important",
                         },
                       },
                     },
                   },
                  actionBar: {
                    actions: ['clear', 'cancel', 'accept'],
                    sx: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: { xs: "8px 16px", sm: "12px 24px" },
                      '& .MuiPickersActionBar-actionButton:first-of-type': {
                        marginRight: 'auto',
                      },
                      '& .MuiPickersActionBar-actionButton': {
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        padding: { xs: "6px 12px", sm: "8px 16px" },
                      },
                    },
                  },
                  popper: {
                    sx: {
                      zIndex: 1300,
                      position: { xs: 'fixed !important', sm: 'absolute' },
                      top: { xs: '50% !important', sm: 'auto' },
                      left: { xs: '50% !important', sm: 'auto' },
                      transform: { xs: 'translate(-50%, -50%) !important', sm: 'none' },
                      // width: { xs: '90vw !important', sm: 'auto' },
                      // maxWidth: { xs: '400px !important', sm: 'none' },
                      maxHeight: { xs: '80vh !important', sm: 'none' },
                      margin: { xs: '0 !important', sm: 'auto' },
                      borderRadius: { xs: '12px !important', sm: '8px' },
                      boxShadow: {
                        xs: '0 20px 40px rgba(0,0,0,0.3) !important',
                        sm: '0 4px 20px rgba(0,0,0,0.15)'
                      },
                      '& .MuiPaper-root': {
                        position: { xs: 'fixed !important', sm: 'absolute' },
                        top: { xs: '50% !important', sm: 'auto' },
                        left: { xs: '50% !important', sm: 'auto' },
                        transform: { xs: 'translate(-50%, -50%) !important', sm: 'none' },
                        // width: { xs: '90vw !important', sm: 'auto' },
                        // maxWidth: { xs: '400px !important', sm: 'none' },
                        maxHeight: { xs: '80vh !important', sm: 'none' },
                        margin: { xs: '0 !important', sm: 'auto' },
                        borderRadius: { xs: '12px !important', sm: '8px' },
                        boxShadow: {
                          xs: '0 20px 40px rgba(0,0,0,0.3) !important',
                          sm: '0 4px 20px rgba(0,0,0,0.15)'
                        },
                      },
                    },
                  },
                }}
                format="DD/MM/YYYY HH:mm"
                ampm={false} 
              />
            </LocalizationProvider>
          </div>

          <Divider />
          <div>
            <Typography variant="subtitle1" sx={{ fontSize: "12px", mb: 0.5 }}>
              Department
            </Typography>
            <SingleValueAsynAutocomplete
              value={dept}
              qtkMethod={triggerDept}
              onChange={setDept}
              loading={deptLoading}
              isFallback={true}
              variant={"standard"}
              size="small"
              showIcon={false}
              optionLabelKey="deptName"
            />
          </div>
          <div>
            <Typography variant="subtitle1" sx={{ fontSize: "12px", mb: 0.5 }}>
              Agent
            </Typography>
            <SingleValueAsynAutocomplete
              value={agent}
              // label="Assignee"
              qtkMethod={triggerSeachAgent}
              onChange={setAgent}
              loading={seachAgentLoading}
              variant={"standard"}
              size="small"
              showIcon={false}
            />
          </div>
          <Divider />
          <div>
            <Typography variant="subtitle1" sx={{ fontSize: "12px" }}>
              Tags
            </Typography>
            <Autocomplete
              multiple
              disableClearable
              popupIcon={null}
              getOptionLabel={(option) => {
                if (typeof option === "string") return option;
                return option.tagName || option.name || "";
              }}
              options={displayOptions}
              value={tagValue}
              onChange={(event, newValue) => {
                handleSelectedOption(event, newValue, "tag");
              }}
              onInputChange={(_, value) => setChangeTabValue(value)}
              filterOptions={(x) => x}
              getOptionDisabled={(option) => option === "Type to search"}
              noOptionsText={
                changeTagValue.length < 3
                  ? "Type at least 3 characters to search"
                  : "No tags found"
              }
              renderOption={(props, option) => {
                return (
                  <li {...props}>
                    {typeof option === "string" ? (
                      option
                    ) : (
                      <div
                        className="flex items-center gap-3 p-1 rounded-md w-full"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="flex flex-col">
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            {option.tagName}
                          </Typography>
                        </div>
                      </div>
                    )}
                  </li>
                );
              }}
              renderTags={(editTags, getTagProps) =>
                editTags?.map((option, index) => (
                  <Chip
                    key={index}
                    label={
                      typeof option === "string"
                        ? option
                        : option.name ?? option.tagName
                    }
                    onDelete={() => {
                      const newTags = editTags.filter((_, i) => i !== index);
                      setTagValue(newTags);
                    }}
                    sx={{
                      "& .MuiChip-deleteIcon": {
                        color: "error.main",
                      },
                      "& .MuiChip-deleteIcon:hover": {
                        color: "#e87f8c",
                      },
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  size="medium"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "4px",
                      backgroundColor: "#f9fafb",
                      "&:hover fieldset": { borderColor: "#9ca3af" },
                      "&.Mui-focused fieldset": { borderColor: "#1a73e8" },
                    },
                    "& label.Mui-focused": { color: "#1a73e8" },
                    "& label": { fontWeight: "bold" },
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="my-2 px-2 sm:px-0">
        <Button
          fullWidth
          variant="contained"
          onClick={handleUpdateTicket}
          disabled={statusLoading}
          sx={{
            padding: { xs: "12px 16px", sm: "10px 24px" },
            fontSize: { xs: "14px", sm: "16px" },
            fontWeight: { xs: 600, sm: 500 },
            borderRadius: { xs: "8px", sm: "4px" },
            textTransform: "none",
            boxShadow: { xs: "0 2px 8px rgba(0,0,0,0.15)", sm: "none" },
          }}
        >
          {statusLoading ? (
            <CircularProgress color="primary" size={20} />
          ) : (
            "Update"
          )}
        </Button>
      </div>
    </div>
  );
};

export default StatusTab;
