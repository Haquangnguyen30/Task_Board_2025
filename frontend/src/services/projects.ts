import API from "./api";
import { Project, CreateProjectData, UpdateProjectData } from "../types";

export const projectsService = {
  async getProjects(): Promise<Project[]> {
    const response = await API.get<Project[]>("/projects");
    return response.data;
  },

  async getProject(id: string): Promise<Project> {
    const response = await API.get<Project>(`/projects/${id}`);
    return response.data;
  },

  async createProject(projectData: CreateProjectData): Promise<Project> {
    const response = await API.post<Project>("/projects", projectData);
    return response.data;
  },

  async updateProject(
    id: string,
    projectData: UpdateProjectData
  ): Promise<Project> {
    const response = await API.put<Project>(`/projects/${id}`, projectData);
    return response.data;
  },

  async deleteProject(id: string): Promise<void> {
    await API.delete(`/projects/${id}`);
  },

  async getProjectMembers(id: string) {
    const response = await API.get(`/projects/${id}/members`);
    return response.data;
  },
};
