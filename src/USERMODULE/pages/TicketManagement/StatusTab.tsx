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
} from "../../../services/ticketAuth";
import {
  useLazyGetAgentsBySeachQuery,
  useLazyGetDepartmentBySeachQuery,
} from "../../../services/agentServices";

const typeOptions = [
  {
    id: "",
    label: "--",
  },
  {
    id: "question",
    label: "Question",
  },
  {
    id: "incident",
    label: "Incident",
  },
  {
    id: "problem",
    label: "Problem",
  },
  {
    id: "req",
    label: "Feature Request",
  },
  {
    id: "refund",
    label: "Refund",
  },
];

const StatusTab = ({ ticket }: any) => {
  const [tagValue, setTagValue] = useState<any[]>([]);
  const [changeTagValue, setChangeTabValue] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [dept, setDept] = useState("");
  const [changeDept, setChangedept] = useState("");
  const [agent, setAgent] = useState("");
  const [onChangeAgent, setOnChangeAgent] = useState("");
  const [agentOptions, setAgentOptions] = useState<any>([]);
  const [options, setOptions] = useState<any>([]);
  const [departmentOptions, setDepartmentOptions] = useState<any>([]);
  const { data: tagList } = useGetTagListQuery();
  const { data: priorityList } = useGetPriorityListQuery();
  const { data: statusList } = useGetStatusListQuery();
  const [triggerDept, { isLoading: deptLoading }] =
    useLazyGetDepartmentBySeachQuery();
  const [triggerSeachAgent, { isLoading: seachAgentLoading }] =
    useLazyGetAgentsBySeachQuery();

  const displayOptions = changeTagValue.length >= 3 ? options : [];
  const displayDepartmentOptions = changeDept ? departmentOptions : [];

  const displayAgentOptions = onChangeAgent ? agentOptions : [];

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

  const fetchDeptOptions = async (query: string) => {
    if (!query) {
      setDepartmentOptions([]);
      return;
    }

    try {
      const res = await triggerDept({
        search: query,
      }).unwrap();
      const data = Array.isArray(res) ? res : res?.data;

      const currentValue = changeDept;
      const fallback = [
        {
          deptName: currentValue,
        },
      ];

      if (Array.isArray(data)) {
        setDepartmentOptions(data.length > 0 ? data : fallback);
      } else {
        setDepartmentOptions([]);
      }
    } catch (error) {
      setDepartmentOptions([]);
    }
  };

  const fetchAgentOptions = async (query: string) => {
    if (!query) {
      setAgentOptions([]);
      return;
    }

    try {
      const res = await triggerSeachAgent({
        search: query,
      }).unwrap();
      const data = Array.isArray(res) ? res : res?.data;

      const currentValue = onChangeAgent;
      const fallback = [
        {
          fName: currentValue,
          emailAddress: currentValue,
        },
      ];

      if (Array.isArray(data)) {
        setAgentOptions(data.length > 0 ? data : fallback);
      } else {
        setAgentOptions([]);
      }
    } catch (error) {
      setAgentOptions([]);
    }
  };

  const handleSelectedOption = (_: any, newValue: any, type: string) => {
    if (type === "tag") {
      if (!Array.isArray(newValue)) return;

      const normalizedNewValue = newValue.map((tag: any) => ({
        tagId: tag.tagId ?? tag.tagID,
        tagName: tag.tagName,
      }));

      const previousTagIds = tagValue.map((tag: any) => tag.tagId);
      const newlyAddedTag = normalizedNewValue.find(
        (tag: any) => !previousTagIds.includes(tag.tagId)
      );

      if (newlyAddedTag) {
        setTagValue((prev: any) => [...prev, newlyAddedTag]);
      } else {
        setTagValue(normalizedNewValue);
      }
    }
    if (type === "dept") {
      setDept(newValue);
    }
    if (type === "agent") {
      const values = newValue.fName;
      setAgent(values);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-100px)] overflow-hidden ">
      <div className="w-full min-h-[calc(100vh-265px)] max-h-[calc(100vh-265px)] overflow-y-auto  ">
        <div className="w-full space-y-3 p-3">
          <Typography variant="subtitle1">Properties</Typography>

          <div>
            <Typography variant="subtitle1" sx={{ fontSize: "12px" }}>
              Type
            </Typography>
            <Select
              variant="standard"
              fullWidth
              size="medium"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {typeOptions.map((name) => (
                <MenuItem key={name.id} value={name.label}>
                  {name.label}
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
                <MenuItem key={status.key} value={status.statusName}>
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
              {priorityList?.map((priority: any) => (
                <MenuItem key={priority.key} value={priority.priorityName}>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <span
                      className="w-3 h-3 inline-block"
                      style={{ backgroundColor: priority.color }}
                    />
                    {priority.specification}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </div>
          <Divider />
          <div>
            <Typography variant="subtitle1" sx={{ fontSize: "12px" }}>
              Department
            </Typography>
            <Autocomplete
              disableClearable
              popupIcon={null}
              sx={{ my: 1.5 }}
              getOptionLabel={(option: any) => {
                if (typeof option === "string") return option;
                return option.deptName || "";
              }}
              options={displayDepartmentOptions}
              value={dept}
              onChange={(event, newValue) => {
                handleSelectedOption(event, newValue, "dept");
              }}
              onInputChange={(_, value) => {
                setChangedept(value);
                fetchDeptOptions(value);
              }}
              filterOptions={(x) => x}
              getOptionDisabled={(option) => option === "Type to search"}
              noOptionsText={
                <div>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {deptLoading ? (
                      <CircularProgress size={18} />
                    ) : (
                      "Type to search"
                    )}
                  </Typography>
                </div>
              }
              renderOption={(props, option: any) => (
                <li {...props}>
                  {typeof option === "string" ? (
                    option
                  ) : (
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {option.deptName}
                    </Typography>
                  )}
                </li>
              )}
              renderTags={(toValue, getTagProps) =>
                toValue?.map((option, index) => (
                  <Chip
                    variant="outlined"
                    color="primary"
                    label={typeof option === "string" ? option : option}
                    {...getTagProps({ index })}
                    sx={{
                      cursor: "pointer",
                      height: "20px",
                      // backgroundColor: "#6EB4C9",
                      color: "primary.main",
                      "& .MuiChip-deleteIcon": {
                        color: "error.main",
                        width: "12px",
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
                  variant="standard"
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
          <div>
            <Typography variant="subtitle1" sx={{ fontSize: "12px" }}>
              Agent
            </Typography>
            <Autocomplete
              disableClearable
              popupIcon={null}
              sx={{ my: 1.5 }}
              getOptionLabel={(option: any) => {
                if (typeof option === "string") return option;
                return option.deptName || "";
              }}
              options={displayAgentOptions}
              value={agent}
              onChange={(event, newValue) => {
                handleSelectedOption(event, newValue, "agent");
              }}
              onInputChange={(_, value) => {
                setOnChangeAgent(value);
                fetchAgentOptions(value);
              }}
              filterOptions={(x) => x}
              getOptionDisabled={(option) => option === "Type to search"}
              noOptionsText={
                <div>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {seachAgentLoading ? (
                      <CircularProgress size={18} />
                    ) : (
                      "Type to search"
                    )}
                  </Typography>
                </div>
              }
              renderOption={(props, option: any) => (
                <li {...props}>
                  {typeof option === "string" ? (
                    option
                  ) : (
                    <div className="flex flex-col">
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {option.fName} {option.lName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.emailAddress}
                      </Typography>
                    </div>
                  )}
                </li>
              )}
              renderTags={(toValue, getTagProps) =>
                toValue?.map((option: any, index) => (
                  <Chip
                    variant="outlined"
                    color="primary"
                    label={typeof option === "string" ? option : option.fName}
                    {...getTagProps({ index })}
                    sx={{
                      cursor: "pointer",
                      height: "20px",
                      // backgroundColor: "#6EB4C9",
                      color: "primary.main",
                      "& .MuiChip-deleteIcon": {
                        color: "error.main",
                        width: "12px",
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
                  variant="standard"
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
      <div className="my-2">
        <Button fullWidth variant="contained">
          Update
        </Button>
      </div>
    </div>
  );
};

export default StatusTab;
