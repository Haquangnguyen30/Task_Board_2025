import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { Task } from "../../../types";

interface TaskCardProps {
  task: Task;
  onClick: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "error";
      case "high":
        return "warning";
      case "medium":
        return "info";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const handleClick = () => {
    onClick(task._id);
  };

  return (
    <Card
      sx={{
        mb: 1,
        cursor: "grab",
        "&:hover": {
          boxShadow: 3,
        },
      }}
      onClick={handleClick}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            component="h3"
            noWrap
            sx={{ flex: 1, mr: 1 }}
          >
            {task.title}
          </Typography>
          <Chip
            label={task.priority}
            size="small"
            color={getPriorityColor(task.priority) as any}
            variant="outlined"
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {task.description || "No description"}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {task.assigneeId ? (
              <Avatar sx={{ width: 24, height: 24 }}>
                {task.assigneeId.name.charAt(0).toUpperCase()}
              </Avatar>
            ) : (
              <PersonIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            )}
            <Typography variant="caption" color="text.secondary">
              {task.assigneeId ? task.assigneeId.name : "Unassigned"}
            </Typography>
          </Box>

          {task.dueDate && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarIcon sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
