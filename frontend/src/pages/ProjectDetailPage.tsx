import React, { useState } from "react";
import {
  Container,
  Grid,
  Button,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  CircularProgress,
} from "@mui/material";
import { NavigateNext, Add } from "@mui/icons-material";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { projectsService, tasksService } from "../services";
import { useWebSocket } from "../hooks/useWebSocket";
import { useTasks } from "../hooks/useTasks";
import TaskColumn from "../components/Task/TaskColumn";
import TaskModal from "../components/Task/TaskModal";
import Loading from "../components/Common/Loading";

const statusColumns = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = id as string;
  const navigate = useNavigate();
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  // WebSocket for real-time updates
  useWebSocket(projectId);

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectsService.getProject(projectId),
  });

  const {
    tasks,
    isLoading: tasksLoading,
    updateTaskPosition,
    createTask,
    isCreating,
  } = useTasks(projectId);

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent,
    status: string,
    position: number
  ) => {
    e.preventDefault();
    if (draggedTask) {
      try {
        await updateTaskPosition({
          taskId: draggedTask,
          status,
          position,
        });
        setDraggedTask(null);
      } catch (error) {
        console.error("Failed to update task position:", error);
      }
    }
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      await createTask(taskData);
      setTaskModalOpen(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks
      .filter((task) => task.status === status)
      .sort((a, b) => a.position - b.position);
  };

  if (projectLoading) {
    return <Loading message="Loading project..." />;
  }

  if (!project) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Project not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Breadcrumb */}
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/projects" color="inherit">
          Projects
        </Link>
        <Typography color="text.primary">{project.title}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {project.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {project.description || "No description provided"}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setTaskModalOpen(true)}
        >
          New Task
        </Button>
      </Box>

      {/* Kanban Board */}
      {tasksLoading ? (
        <Loading message="Loading tasks..." />
      ) : (
        <Grid container spacing={3}>
          {statusColumns.map((column) => (
            <Grid item xs={12} sm={6} md={3} key={column.id}>
              <TaskColumn
                title={column.title}
                tasks={getTasksByStatus(column.id)}
                status={column.id}
                onTaskClick={handleTaskClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Task Modal */}
      {project && (
        <TaskModal
          open={taskModalOpen}
          onClose={() => setTaskModalOpen(false)}
          project={project}
          onSubmit={handleCreateTask}
          isSubmitting={isCreating}
        />
      )}
    </Container>
  );
};

export default ProjectDetailPage;
