import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socketService } from "../lib/socket";
import { Task, Comment } from "../types";

export const useWebSocket = (projectId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = socketService.connect();

    socket.on("task-updated", (task: Task) => {
      queryClient.setQueryData(
        ["tasks", projectId],
        (old: Task[] | undefined) => {
          if (!old) return [task];
          return old.map((t) => (t._id === task._id ? task : t));
        }
      );
    });

    socket.on("task-created", (task: Task) => {
      queryClient.setQueryData(
        ["tasks", projectId],
        (old: Task[] | undefined) => {
          if (!old) return [task];
          return [...old, task];
        }
      );
    });

    socket.on("task-deleted", (taskId: string) => {
      queryClient.setQueryData(
        ["tasks", projectId],
        (old: Task[] | undefined) => {
          if (!old) return [];
          return old.filter((t) => t._id !== taskId);
        }
      );
    });

    socket.on("comment-added", (comment: Comment) => {
      queryClient.invalidateQueries({ queryKey: ["comments", comment.taskId] });
    });

    socket.on("comment-deleted", (commentId: string) => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    });

    return () => {
      socket.off("task-updated");
      socket.off("task-created");
      socket.off("task-deleted");
      socket.off("comment-added");
      socket.off("comment-deleted");
    };
  }, [projectId, queryClient]);
};
