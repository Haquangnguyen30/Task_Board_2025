import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Avatar,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Divider,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  NavigateNext,
  Delete as DeleteIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksService, commentsService } from "../services";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Common/Loading";

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const taskId = id as string;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");

  const { data: task, isLoading: taskLoading } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => tasksService.getTask(taskId),
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => commentsService.getCommentsByTask(taskId),
  });

  const createCommentMutation = useMutation({
    mutationFn: commentsService.createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
      setNewComment("");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: commentsService.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    createCommentMutation.mutate({
      content: newComment,
      taskId: taskId,
    });
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "default";
      case "in-progress":
        return "primary";
      case "review":
        return "secondary";
      case "done":
        return "success";
      default:
        return "default";
    }
  };

  if (taskLoading) {
    return <Loading message="Loading task details..." />;
  }

  if (!task) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Task not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Breadcrumb */}
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/projects" color="inherit">
          Projects
        </Link>
        <Link
          component={RouterLink}
          to={`/projects/${task.projectId}`}
          color="inherit"
        >
          Project
        </Link>
        <Typography color="text.primary">Task</Typography>
      </Breadcrumbs>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 3,
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom>
                {task.title}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip
                  label={task.status}
                  color={getStatusColor(task.status) as any}
                  variant="outlined"
                />
                <Chip
                  label={task.priority}
                  color={getPriorityColor(task.priority) as any}
                />
              </Box>
            </Box>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ whiteSpace: "pre-wrap", mb: 4 }}
            >
              {task.description || "No description provided."}
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={6}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <PersonIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Assignee
                    </Typography>
                    <Typography variant="body2">
                      {task.assigneeId ? task.assigneeId.name : "Unassigned"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <CalendarIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Due Date
                    </Typography>
                    <Typography variant="body2">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "No due date"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Comments Section */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Comments ({comments?.length || 0})
            </Typography>

            {/* Add Comment Form */}
            <Box component="form" onSubmit={handleAddComment} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!newComment.trim() || createCommentMutation.isPending}
              >
                {createCommentMutation.isPending ? "Adding..." : "Add Comment"}
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Comments List */}
            {commentsLoading ? (
              <Loading message="Loading comments..." />
            ) : comments && comments.length > 0 ? (
              <List>
                {comments.map((comment) => (
                  <React.Fragment key={comment._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>
                          {comment.userId.name.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <Box>
                              <Typography variant="subtitle2">
                                {comment.userId.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(comment.createdAt).toLocaleString()}
                              </Typography>
                            </Box>
                            {comment.userId._id === user?.id && (
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteComment(comment._id)}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ whiteSpace: "pre-wrap", mt: 1 }}
                          >
                            {comment.content}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="body2" color="text.secondary">
                  No comments yet. Be the first to comment!
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Task Information
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Created By
                </Typography>
                <Typography variant="body2">{task.createdBy.name}</Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Created At
                </Typography>
                <Typography variant="body2">
                  {new Date(task.createdAt).toLocaleDateString()}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Last Updated
                </Typography>
                <Typography variant="body2">
                  {new Date(task.updatedAt).toLocaleDateString()}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Project
                </Typography>
                <Button
                  variant="text"
                  onClick={() => navigate(`/projects/${task.projectId}`)}
                  sx={{ p: 0, textTransform: "none" }}
                >
                  Go to Project
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TaskDetailPage;
