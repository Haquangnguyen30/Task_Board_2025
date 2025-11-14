import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { Task } from "../../types";
import TaskCard from "./TaskCard";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: string;
  onTaskClick: (taskId: string) => void;
  onDragOver: (e: React.DragEvent, status: string) => void;
  onDrop: (e: React.DragEvent, status: string, position: number) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  status,
  onTaskClick,
  onDragOver,
  onDrop,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "#f5f5f5";
      case "in-progress":
        return "#e3f2fd";
      case "review":
        return "#fff3e0";
      case "done":
        return "#e8f5e8";
      default:
        return "#f5f5f5";
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        minHeight: 600,
        backgroundColor: getStatusColor(status),
        display: "flex",
        flexDirection: "column",
      }}
      onDragOver={(e) => onDragOver(e, status)}
      onDrop={(e) => onDrop(e, status, tasks.length)}
    >
      <Typography variant="h6" gutterBottom align="center">
        {title} ({tasks.length})
      </Typography>

      <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        {tasks.map((task, index) => (
          <Box
            key={task._id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("taskId", task._id);
            }}
            onDragOver={(e) => onDragOver(e, status)}
            onDrop={(e) => onDrop(e, status, index)}
          >
            <TaskCard task={task} onClick={onTaskClick} />
          </Box>
        ))}

        {tasks.length === 0 && (
          <Box
            sx={{
              height: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Drop tasks here
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default TaskColumn;
