import {
  Autocomplete,
  Button,
  Chip,
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
const groupOptions = [
  {
    id: "",
    label: "--",
  },
  {
    id: "depart",
    label: "Department",
  },
];

const agentOptions = [
  {
    id: "",
    label: "--",
  },
];

const StatusTab = ({ ticket }: any) => {
  const [tagValue, setTagValue] = useState<any[]>([]);
  const [changeTagValue, setChangeTabValue] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [group, setGroup] = useState("");
  const [agent, setAgent] = useState("");
  const [options, setOptions] = useState<any>([]);
  const { data: tagList } = useGetTagListQuery();
  const { data: priorityList } = useGetPriorityListQuery();
  const { data: statusList } = useGetStatusListQuery();

  const displayOptions = changeTagValue.length >= 3 ? options : [];

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

  const handleSelectedOption = (_: any, newValue: any) => {
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
  };

  return (
    <div className="w-full h-[calc(100vh-100px)] overflow-hidden ">
      <div className="w-full min-h-[calc(100vh-265px)] max-h-[calc(100vh-265px)] overflow-y-auto  ">
        <Typography variant="subtitle1">Status</Typography>
        <div className="my-2">
          <div className="flex items-center gap-2">
            {" "}
            <span className="w-2 h-2 inline-block rounded-full bg-red-500" />
            <Typography
              variant="subtitle2"
              sx={{ textTransform: "capitalize", fontSize: "14px" }}
            >
              First Response Due
            </Typography>
          </div>
          <Typography variant="subtitle1" sx={{ fontSize: "12px" }}>
            by Fri, Jul 11, 2025 4:00 PM
          </Typography>
        </div>
        <div className="mb-5">
          <div className="flex items-center gap-2">
            {" "}
            <span className="w-2 h-2 inline-block rounded-full bg-red-500" />
            <Typography
              variant="subtitle2"
              sx={{ textTransform: "capitalize", fontSize: "14px" }}
            >
              First Response Due
            </Typography>
          </div>
          <Typography variant="subtitle1" sx={{ fontSize: "12px" }}>
            by Fri, Jul 11, 2025 4:00 PM
          </Typography>
        </div>

        <Divider />

        <div className="w-full mt-2 space-y-3">
          <Typography variant="subtitle1">Properties</Typography>
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
                handleSelectedOption(event, newValue);
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
                    variant="outlined"
                    color="primary"
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
                      cursor: "pointer",
                      height: "20px",
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
                  variant="outlined"
                  size="small"
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
              Type
            </Typography>
            <Select
              fullWidth
              size="small"
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
              size="small"
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
              size="small"
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
          <div>
            <Typography variant="subtitle1" sx={{ fontSize: "12px" }}>
              Group
            </Typography>
            <Select
              fullWidth
              size="small"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            >
              {groupOptions.map((name) => (
                <MenuItem key={name.id} value={name.label}>
                  {name.label}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <Typography variant="subtitle1" sx={{ fontSize: "12px" }}>
              Agent
            </Typography>
            <Select
              fullWidth
              size="small"
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
            >
              {agentOptions.map((name) => (
                <MenuItem key={name.id} value={name.label}>
                  {name.label}
                </MenuItem>
              ))}
            </Select>
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
