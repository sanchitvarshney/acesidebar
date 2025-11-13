import React from "react";
import {
  Checkbox,
  Button,
  TablePagination,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";

interface TaskHeaderProps {
  totalTasks: number;
  selectedTasks: number;
  masterChecked: boolean;
  page: number;
  rowsPerPage: number;
  totalPages?: number;
  onMasterCheckboxChange: (checked: boolean) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onCreateTask: () => void;
  viewMode?: any;
  changeViewMode?: any;
  isAddTask?: boolean;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
  totalTasks,
  selectedTasks,
  masterChecked,
  page,
  rowsPerPage,
  totalPages,
  onMasterCheckboxChange,
  onPageChange,
  onRowsPerPageChange,
  onCreateTask,
  changeViewMode,
  viewMode,
  isAddTask,
}) => {
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    // Translate MUI's 0-based page to app's 1-based page
    onPageChange(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  return (
    <div className="flex items-center justify-between px-2 py-1 border border-[#e0e0e0] bg-[#e0e0e0] shadow-sm">
      <div className="flex items-center  gap-2 flex-1 min-w-0">
        <Checkbox
          checked={masterChecked}
          onChange={(e) => onMasterCheckboxChange(e.target.checked)}
          aria-label="Select all tasks"
          sx={{
            mr: 1,
            color: "#666",
            "&.Mui-checked": {
              color: "#1a73e8",
            },
            "&:hover": {
              backgroundColor: "rgba(26, 115, 232, 0.04)",
            },
          }}
        />
        <span className="text-md font-semibold whitespace-nowrap">
          My Tasks
        </span>
        <span className="bg-[#f0f4f9] text-gray-700 rounded px-2 py-0.5 text-xs font-semibold ml-1">
          {totalTasks}
        </span>

        {selectedTasks > 0 && (
          <div className="flex items-center gap-2 ml-4 flex-wrap">
            <span className="text-sm text-gray-600">
              {selectedTasks} selected
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Pagination */}
        {viewMode === "list" && (
          <TablePagination
            component="div"
            count={totalTasks ?? 0}
            page={page - 1} // MUI TablePagination uses 0-based indexing
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20, 50]}
            labelRowsPerPage=""
            sx={{
              ".MuiTablePagination-selectLabel": {
                display: "none",
              },
              ".MuiTablePagination-displayedRows": {
                margin: 0,
              },
            }}
          />
        )}

        {!isAddTask && (
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newView) => {
              if (newView !== null) changeViewMode(newView);
            }}
            aria-label="view mode"
            size="small"
            sx={{
              p: 0.8,
              borderRadius: 9999,
              backgroundColor: "#fff",
              border: "1px solid #dbe3ee",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
              "& .MuiToggleButtonGroup-grouped": {
                m: 0.25,
                border: 0,
                borderRadius: 9999,
                textTransform: "none",
                fontWeight: 600,
                color: "#5b6b7c",
                px: 1,
                py: 0.5,
                minHeight: 35,
                gap: 2,
                "&:hover": {
                  backgroundColor: "#e7edf6",
                },
                "&.Mui-selected": {
                  backgroundColor: "#1a73e8",
                  color: "#fff",
                  boxShadow: "0 1px 2px rgba(26,115,232,0.35)",
                  "&:hover": {
                    backgroundColor: "#1557b0",
                  },
                },
              },
            }}
            color="primary"
          >   <ToggleButton value="list" aria-label="list view" disableRipple sx={{width:"100px"}}>
            <ViewListIcon sx={{ fontSize: 18 }} />
            List
          </ToggleButton>
          <ToggleButton value="kanban" aria-label="kanban view" disableRipple sx={{width:"100px"}}>
            <ViewKanbanIcon sx={{ fontSize: 18 }} />
            Kanban
          </ToggleButton></ToggleButtonGroup>
        )}
        <Button
          variant="contained"
          size="small"
          onClick={onCreateTask}
          sx={{
            textTransform: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
            backgroundColor: "#2566b0",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          + New Task
        </Button>
      </div>
    </div>
  );
};

export default TaskHeader;
