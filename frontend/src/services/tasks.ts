import API from "./api";
import { Task, CreateTaskData, UpdateTaskData } from "../types";

export const tasksService = {
  async getTasksByProject(projectId: string): Promise<Task[]> {
    const response = await API.get<Task[]>(`/tasks/project/${projectId}`);
    return response.data;
  },

  async getTask(id: string): Promise<Task> {
    const response = await API.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  async createTask(taskData: CreateTaskData): Promise<Task> {
    const response = await API.post<Task>("/tasks", taskData);
    return response.data;
  },

  async updateTask(id: string, taskData: UpdateTaskData): Promise<Task> {
    const response = await API.put<Task>(`/tasks/${id}`, taskData);
    return response.data;
  },

  async updateTaskPosition(
    id: string,
    status: string,
    position: number
  ): Promise<Task> {
    const response = await API.put<Task>(`/tasks/${id}/position`, {
      status,
      position,
    });
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await API.delete(`/tasks/${id}`);
  },
};
