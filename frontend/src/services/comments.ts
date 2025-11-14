import API from "./api";
import { Comment, CreateCommentData } from "../types";

export const commentsService = {
  async getCommentsByTask(taskId: string): Promise<Comment[]> {
    const response = await API.get<Comment[]>(`/comments/task/${taskId}`);
    return response.data;
  },

  async createComment(commentData: CreateCommentData): Promise<Comment> {
    const response = await API.post<Comment>("/comments", commentData);
    return response.data;
  },

  async deleteComment(id: string): Promise<void> {
    await API.delete(`/comments/${id}`);
  },
};
