import React, {
  memo,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  FilterList as FilterListIcon,
  ManageSearch as ManageSearchIcon,
} from "@mui/icons-material";
import BrowseGalleryIcon from "@mui/icons-material/BrowseGallery";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AttachmentIcon from "@mui/icons-material/Attachment";
import InsertCommentIcon from "@mui/icons-material/InsertComment";

interface TaskListProps {
  tasks: any;
  selectedTasks: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTaskSelect: (taskId: string, checked: boolean) => void;
  onAdvancedSearchOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
  getStatusIcon: (status: string) => React.ReactNode;
  isAddTask?: boolean;
  isLoading?: boolean;
  onTaskTitleClick?: (task: any) => void;
}

const TaskList: React.FC<TaskListProps> = memo(
  ({
    tasks,
    selectedTasks,
    searchQuery,
    onSearchChange,
    onTaskSelect,
    onAdvancedSearchOpen,
    getStatusIcon,
    isAddTask,
    isLoading,
    onTaskTitleClick,
  }) => {
    const taskData = useMemo(() => tasks?.data || [], [tasks]);

    const statusOptions = useMemo(() => {
      const map = new Map<string, string>();
      taskData?.forEach((task: any) => {
        const key = task?.status?.key ?? task?.status;
        if (key) {
          map.set(String(key), task?.status?.name ?? task?.status?.statusName ?? String(key));
        }
      });
      return Array.from(map.entries()).map(([key, label]) => ({
        key,
        label,
      }));
    }, [taskData]);

    const priorityOptions = useMemo(() => {
      const map = new Map<string, { label: string; color?: string }>();
      taskData?.forEach((task: any) => {
        const key = task?.priority?.key ?? task?.priority;
        if (key) {
          map.set(String(key), {
            label: task?.priority?.name ?? task?.priority?.label ?? String(key),
            color: task?.priority?.color,
          });
        }
      });
      return Array.from(map.entries()).map(([key, meta]) => ({
        key,
        ...meta,
      }));
    }, [taskData]);

    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [priorityFilter, setPriorityFilter] = useState<string[]>([]);

    const toggleStatusFilter = useCallback((key: string, checked: boolean) => {
      setStatusFilter((prev) =>
        checked ? [...prev, key] : prev.filter((value) => value !== key)
      );
    }, []);

    const togglePriorityFilter = useCallback(
      (key: string, checked: boolean) => {
        setPriorityFilter((prev) =>
          checked ? [...prev, key] : prev.filter((value) => value !== key)
        );
      },
      []
    );

    const clearFilters = useCallback(() => {
      setStatusFilter([]);
      setPriorityFilter([]);
    }, []);

    const filteredTasks = useMemo(() => {
      return (taskData || []).filter((task: any) => {
        const statusKey = task?.status?.key ?? task?.status;
        const priorityKey = task?.priority?.key ?? task?.priority;

        const statusMatch =
          statusFilter.length === 0 ||
          (statusKey ? statusFilter.includes(String(statusKey)) : false);

        const priorityMatch =
          priorityFilter.length === 0 ||
          (priorityKey ? priorityFilter.includes(String(priorityKey)) : false);

        return statusMatch && priorityMatch;
      });
    }, [taskData, statusFilter, priorityFilter]);

    return (
      <div className="flex h-[calc(100vh-138px)] bg-white border border-[#e5e7eb] rounded-lg overflow-hidden shadow-sm">
        <Box
          component="aside"
          sx={{
            width: { xs: "100%", md: 320 },
            maxWidth: 360,
            borderRight: "1px solid #e5e7eb",
            backgroundColor: "#f8fafc",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ p: 3, borderBottom: "1px solid #e5e7eb" }}>
            <Typography variant="h6" fontWeight={600}>
              Filters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Refine the task list using the controls below.
            </Typography>
          </Box>

          {!isAddTask ? (
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
              className="custom-scrollbar"
            >
              <TextField
                placeholder="Search tasks or tickets"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ManageSearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="outlined"
                startIcon={<FilterListIcon fontSize="small" />}
                  onClick={(e) => onAdvancedSearchOpen(e)}
                sx={{ textTransform: "none", justifyContent: "flex-start", fontWeight: 600 }}
              >
                Advanced filters
              </Button>

              {statusOptions.length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    gutterBottom
                    color="text.secondary"
                  >
                    Status
                  </Typography>
                  <FormGroup>
                    {statusOptions.map((option) => (
                      <FormControlLabel
                        key={option.key}
                        control={
                          <Checkbox
                            size="small"
                            checked={statusFilter.includes(option.key)}
                            onChange={(event) =>
                              toggleStatusFilter(option.key, event.target.checked)
                            }
                          />
                        }
                        label={option.label}
                      />
                    ))}
                  </FormGroup>
                </Box>
              )}

              {priorityOptions.length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    gutterBottom
                    color="text.secondary"
                  >
                    Priority
                  </Typography>
                  <FormGroup>
                    {priorityOptions.map((option) => (
                      <FormControlLabel
                        key={option.key}
                        control={
                          <Checkbox
                            size="small"
                            checked={priorityFilter.includes(option.key)}
                            onChange={(event) =>
                              togglePriorityFilter(option.key, event.target.checked)
                            }
                          />
                        }
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {option.color && (
                              <span
                                style={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: "50%",
                                  backgroundColor: option.color,
                                  display: "inline-block",
                                }}
                              />
                            )}
                            {option.label}
                          </Box>
                        }
                      />
                    ))}
                  </FormGroup>
                </Box>
              )}

              {(statusFilter.length > 0 || priorityFilter.length > 0) && (
                <Box>
                  <Divider sx={{ mb: 1 }} />
                  <Button
                    variant="text"
                    color="primary"
                    onClick={clearFilters}
                    sx={{ textTransform: "none", fontWeight: 600, pl: 0 }}
                  >
                    Clear filters
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 3,
                textAlign: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Filters are disabled while adding a new task.
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto",
            px: 3,
            py: 4
          }}
          className="custom-scrollbar"
        >
          {isLoading ? (
            <Box
              sx={{
                p: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
              }}
            >
              <Typography variant="body2">Loading tasks…</Typography>
            </Box>
          ) : filteredTasks.length === 0 ? (
            <Box
              sx={{
                p: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 1,
                color: "text.secondary",
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                No tasks found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Adjust your filters or search query to see tasks.
              </Typography>
            </Box>
          ) : (
            filteredTasks.map((task: any) => {
              const taskKey = task?.taskKey ?? task?.taskID ?? "";
              const isSelected = selectedTasks.includes(taskKey);
              const tags: string[] = Array.isArray(task?.tags)
                ? task.tags
                : typeof task?.tags === "string" && task.tags.length > 0
                  ? task.tags.split(",").map((tag: string) => tag.trim())
                  : [];
              const statusName = task?.status?.name ?? "No status";
              const statusColor =
                task?.status?.color ||
                task?.status?.statusColor ||
                "#64748b";
              const priorityChipColor =
                task?.priority?.color || "rgba(226,232,240,1)";
              const dueDisplay = task?.due?.dt
                ? `${task?.due?.dt}${task?.due?.tm ? `, ${task?.due?.tm}` : ""}`
                : "No reminder";
              const assignLabel = task?.assignor || "Unassigned";

              const baseColor = statusColor;
              const gradientPill =
                baseColor && baseColor.length === 7
                  ? `linear-gradient(135deg, ${baseColor}cc, ${baseColor})`
                  : `linear-gradient(135deg, rgba(59,130,246,0.95), rgba(37,99,235,1))`;

              return (
                <Box
                  key={taskKey}
                  className="bg-white border-2 border-[#e8eaec] rounded-xl mb-4 p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer relative hover:bg-[#f6f8fb]"
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: 3,
                    border: isSelected
                      ? "2px solid rgba(37,99,235,0.4)"
                      : "1px solid rgba(226,232,240,0.8)",
                    boxShadow: isSelected
                      ? "0 16px 36px rgba(37,99,235,0.22)"
                      : "0 10px 30px rgba(15,23,42,0.12)",
                    px: { xs: 2, md: 3 },
                    py: { xs: 2.2, md: 3 },
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: { xs: 2, md: 2.5 },
                    transition: "all 0.25s ease",
                    "&:hover": {
                      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  {/* Task line */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>

                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, letterSpacing: 0.6, color: "#94a3b8" }}
                      >
                        TASK | {task?.ticketID || "Not linked"}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            event.stopPropagation();
                            onTaskSelect(taskKey, event.target.checked);
                          }}
                          sx={{
                            "&.Mui-checked": {
                              color: "primary.main",
                            },
                          }}
                        />
                        <Box
                          component="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onTaskTitleClick?.(task);
                          }}
                          sx={{
                            border: "none",
                            background: "transparent",
                            padding: 0,
                            margin: 0,
                            cursor: onTaskTitleClick ? "pointer" : "default",
                            textAlign: "left",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{
                              color: "#0f172a",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {task?.title ?? "Untitled Task"}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: 1.25,
                          mt: 0.75,
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="text.secondary"
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <NotificationsActiveOutlinedIcon sx={{ fontSize: 16 }} />
                          {dueDisplay}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="text.secondary"
                        >
                          Assigned • {assignLabel}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", md: "row" },
                          gap: { xs: 1.5, md: 2 },
                          alignItems: "stretch",
                        }}
                      >
                        <Box
                          sx={{
                            flex: 1,
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid rgba(226,232,240,0.9)",
                            backgroundColor: "#f8fafc",
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 700, letterSpacing: 0.6, color: "#94a3b8" }}
                          >
                            PROJECT INFO
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              alignItems: "center",
                              gap: 1,
                              mt: 0.75,
                            }}
                          >
                            <Chip
                              icon={<FiberManualRecordIcon sx={{ fontSize: 12 }} />}
                              label={statusName}
                              size="small"
                              sx={{
                                borderRadius: 999,
                                backgroundColor: `${statusColor}1a`,
                                color: statusColor,
                                fontWeight: 600,
                                textTransform: "capitalize",
                                "& .MuiChip-icon": {
                                  color: statusColor,
                                  marginLeft: 4,
                                },
                              }}
                            />
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.5,
                                px: 1.25,
                                py: 0.5,
                                borderRadius: 999,
                                backgroundColor: `${priorityChipColor}33`,
                                color: "#1f2937",
                                fontWeight: 600,
                              }}
                            >
                              Priority
                              <span>{task?.priority?.name ?? "Not set"}</span>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mt: 1,
                            }}
                          >
                            <Tooltip title="Email">
                              <IconButton
                                size="small"
                                sx={{
                                  backgroundColor: "rgba(59,130,246,0.15)",
                                  color: "#1d4ed8",
                                  "&:hover": { backgroundColor: "rgba(59,130,246,0.25)" },
                                }}
                              >
                                <MailOutlineIcon fontSize="inherit" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Log Note">
                              <IconButton
                                size="small"
                                sx={{
                                  backgroundColor: "rgba(251,191,36,0.18)",
                                  color: "#b45309",
                                  "&:hover": { backgroundColor: "rgba(251,191,36,0.26)" },
                                }}
                              >
                                <ChatBubbleOutlineIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            flex: 1,
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid rgba(226,232,240,0.9)",
                            backgroundColor: "#f8fafc",
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.25,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 700, letterSpacing: 0.6, color: "#94a3b8" }}
                          >
                            EST. EFFORT & ACTIVITY
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              alignItems: "center",
                              gap: 1.25,
                              mt: 0.75,
                            }}
                          >
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 1,
                                px: 1.5,
                                py: 0.75,
                                borderRadius: 999,
                                background: gradientPill,
                                color: "#fff",
                                fontWeight: 600,
                              }}
                            >
                              <BrowseGalleryIcon sx={{ fontSize: 18 }} />
                              {task?.estimate ?? "00:00"}
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 1,
                                width: "100%",
                                mt: 1,
                              }}
                            >
                              <Chip
                                icon={<InsertCommentIcon fontSize="small" />}
                                label={`${task?.other?.comment ?? 0} comments`}
                                size="small"
                                sx={{
                                  borderRadius: 999,
                                  backgroundColor: "rgba(14,165,233,0.15)",
                                  color: "#0f766e",
                                  fontWeight: 600,
                                }}
                              />
                              <Chip
                                icon={<AttachmentIcon fontSize="small" />}
                                label={`${task?.other?.attachment ?? 0} files`}
                                size="small"
                                sx={{
                                  borderRadius: 999,
                                  backgroundColor: "rgba(99,102,241,0.14)",
                                  color: "#4338ca",
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      </div>
    );
  }
);

TaskList.displayName = "TaskList";

export default React.memo(TaskList);
