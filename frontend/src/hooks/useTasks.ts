import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "../services/tasks";
import { CreateTaskData, UpdateTaskData } from "../types";

export const useTasks = (projectId?: string) => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => tasksService.getTasksByProject(projectId!),
    enabled: !!projectId,
  });

  const createTaskMutation = useMutation({
    mutationFn: tasksService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) =>
      tasksService.updateTask(id, data),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(["tasks", projectId], (old: any) =>
        old?.map((task: any) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    },
  });

  const updateTaskPositionMutation = useMutation({
    mutationFn: ({
      id,
      status,
      position,
    }: {
      id: string;
      status: string;
      position: number;
    }) => tasksService.updateTaskPosition(id, status, position),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(["tasks", projectId], (old: any) =>
        old?.map((task: any) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: tasksService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    updateTaskPosition: updateTaskPositionMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
};
