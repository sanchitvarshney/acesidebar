import React from "react";
import { Checkbox, Button, TablePagination } from "@mui/material";

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
    <div className="flex items-center justify-between px-5 py-2 pb-2 border-b w-full bg-[#f0f4f9]">
      <div className="flex items-center gap-2 flex-1 min-w-0">
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
        <span className="text-xl font-semibold whitespace-nowrap">
          My Tasks
        </span>
        <span className="bg-[#f0f4f9] text-gray-700 rounded px-2 py-0.5 text-xs font-semibold ml-1">
          {totalTasks}
        </span>

        <Button variant={viewMode === "list" ? "contained" : "text"} onClick={changeViewMode}>
          List
        </Button>
        <Button variant={viewMode === "kanban" ? "contained" : "text"}  onClick={changeViewMode}>
          Kanban
        </Button>

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
        <Button
          variant="contained"
          size="small"
          onClick={onCreateTask}
          sx={{
            textTransform: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
            backgroundColor: "#1976d2",
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
