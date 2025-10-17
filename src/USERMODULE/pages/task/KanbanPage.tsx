import React, { useCallback, useEffect, useState, useMemo } from "react";

import {
  getStatusIcon,

} from "./utils/taskUtils";

import KanbanBoard from "./components/KanbanBoard";

type TaskPropsType = {
  isAddTask?: boolean;
  ticketId?: string;
};

const KanbanPage: React.FC<TaskPropsType> = ({ isAddTask, ticketId }) => {




  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // State for tasks data
 
 const [tasksData, setTasksData] = React.useState({
    data: [
      {
        taskId: "1",
        taskKey: "TASK-001",
        title: "Fix login authentication bug",
        status: { key: "todo", name: "To Do" },
        priority: { name: "High", color: "#f44336" },
        assignor: "John Doe",
        assignee: "Jane Smith",
        dueDate: "2024-01-15",
        description:
          "Fix the login authentication issue that prevents users from logging in",
        ticketID: "TICKET-001",
      },
      {
        taskId: "2",
        taskKey: "TASK-002",
        title: "Update API documentation",
        status: { key: "doing", name: "Doing" },
        priority: { name: "Medium", color: "#ff9800" },
        assignor: "Mike Johnson",
        assignee: "Sarah Wilson",
        dueDate: "2024-01-20",
        description: "Update API documentation for new endpoints",
        ticketID: "TICKET-002",
      },
      {
        taskId: "3",
        taskKey: "TASK-003",
        title: "Code review for new feature",
        status: { key: "review", name: "Review" },
        priority: { name: "Low", color: "#4caf50" },
        assignor: "Alex Brown",
        assignee: "Tom Davis",
        dueDate: "2024-01-18",
        description: "Review the new user dashboard feature implementation",
        ticketID: "TICKET-003",
      },
      {
        taskId: "4",
        taskKey: "TASK-004",
        title: "Deploy latest version to production",
        status: { key: "release", name: "Release" },
        priority: { name: "High", color: "#f44336" },
        assignor: "Emma Wilson",
        assignee: "Chris Lee",
        dueDate: "2024-01-22",
        description:
          "Deploy the latest stable version to production environment",
        ticketID: "TICKET-004",
      },
      {
        taskId: "5",
        taskKey: "TASK-005",
        title: "Design new user interface",
        status: { key: "unassigned", name: "Unassigned" },
        priority: { name: "Medium", color: "#ff9800" },
        assignor: "David Miller",
        assignee: null,
        dueDate: "2024-01-25",
        description: "Design new user interface for the dashboard",
        ticketID: "TICKET-005",
      },
      {
        taskId: "6",
        taskKey: "TASK-006",
        title: "Performance optimization",
        status: { key: "todo", name: "To Do" },
        priority: { name: "High", color: "#f44336" },
        assignor: "Lisa Anderson",
        assignee: "Mark Thompson",
        dueDate: "2024-01-28",
        description:
          "Optimize application performance for better user experience",
        ticketID: "TICKET-006",
      },
      {
        taskId: "7",
        taskKey: "TASK-007",
        title: "Database migration",
        status: { key: "doing", name: "Doing" },
        priority: { name: "Medium", color: "#ff9800" },
        assignor: "Robert Chen",
        assignee: "Jennifer Lee",
        dueDate: "2024-01-30",
        description:
          "Migrate database to new version with improved performance",
        ticketID: "TICKET-007",
      },
      {
        taskId: "8",
        taskKey: "TASK-008",
        title: "Security audit",
        status: { key: "review", name: "Review" },
        priority: { name: "High", color: "#f44336" },
        assignor: "Michael Park",
        assignee: "Amanda White",
        dueDate: "2024-02-01",
        description: "Conduct comprehensive security audit of the application",
        ticketID: "TICKET-008",
      },
      
    ],
    pagination: {
      currentPage: 1,
      limit: 10,
      totalCount: 8,
      totalPages: 1,
    },
  });
  const taskListDataLoading = false;

  // Function to handle task status updates from drag and drop
  const handleTaskStatusUpdate = useCallback((taskId: string, newStatus: { key: string; name: string }) => {
    setTasksData(prevData => ({
      ...prevData,
      data: prevData.data.map(task => 
        task.taskId === taskId 
          ? { ...task, status: newStatus }
          : task
      )
    }));
    
    // Here you would typically make an API call to update the task status
    console.log(`Task ${taskId} status updated to ${newStatus.name}`);
  }, []);

;

  // Loading states for individual task interactions
  const [loadingTaskId, setLoadingTaskId] = React.useState<string | null>(null);
  const [loadingAttachmentTaskId, setLoadingAttachmentTaskId] = React.useState<
    string | null
  >(null);

  // Removed advanced search functionality
  const [taskId, setTaskId] = useState<any>();

  const fetchTasks = async () => {

  };

  // when component unmount taskId set to empty
  useEffect(() => {
    return () => {
      setTaskId("");
    };
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [page, rowsPerPage, isAddTask, ticketId]);

  // Real-time updates for edit countdown
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const filteredTasks = tasksData?.data || [];

  return (

      <KanbanBoard
        tasks={{
          ...tasksData,
          data: filteredTasks,
        }}
        
 
        searchQuery=""
        onSearchChange={() => {}}
     
        onTaskClick={(task: any) => {
          setTaskId(task);
        }}
        onAdvancedSearchOpen={() => {}}
        getStatusIcon={getStatusIcon}
        isAddTask={isAddTask}
        isLoading={taskListDataLoading}
        loadingTaskId={loadingTaskId}
        loadingAttachmentTaskId={loadingAttachmentTaskId}
        taskId={taskId?.taskId}
        onTaskStatusUpdate={handleTaskStatusUpdate}
      />

  );
};

export default KanbanPage;
