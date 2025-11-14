export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  ownerId: {
    _id: string;
    name: string;
    email: string;
  };
  members: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  status: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "critical";
  assigneeId?: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  projectId: string;
  dueDate?: string;
  position: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  taskId: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  title: string;
  description?: string;
  color?: string;
  members?: string[];
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  color?: string;
  members?: string[];
  status?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  status?: "todo" | "in-progress" | "review" | "done";
  priority?: "low" | "medium" | "high" | "critical";
  dueDate?: string;
  tags?: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  assigneeId?: string;
  status?: "todo" | "in-progress" | "review" | "done";
  priority?: "low" | "medium" | "high" | "critical";
  dueDate?: string;
  tags?: string[];
  position?: number;
}

export interface CreateCommentData {
  content: string;
  taskId: string;
  parentId?: string;
}
