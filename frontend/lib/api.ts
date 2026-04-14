import type {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  Project,
  ProjectWithTasks,
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  CreateProjectInput,
  TaskFilters,
  ApiError,
} from './types';
import { mockUsers, mockProjects, mockTasks, generateId, generateToken } from './mock-data';

// Simulated network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const DELAY_MS = 300;

// In-memory store (mutable copy of mock data)
let users = [...mockUsers];
let projects = [...mockProjects];
let tasks = [...mockTasks];

// Token storage
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function getStoredAuth(): { token: string; user: User } | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  if (token && userStr) {
    try {
      return { token, user: JSON.parse(userStr) };
    } catch {
      return null;
    }
  }
  return null;
}

export function setStoredAuth(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function checkAuth(): void {
  const token = getAuthToken();
  if (!token) {
    const error: ApiError = { error: 'unauthorized' };
    throw error;
  }
}

// Auth API
export const authApi = {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    await delay(DELAY_MS);

    // Validation
    if (!credentials.name?.trim()) {
      const error: ApiError = { error: 'validation failed', fields: { name: 'is required' } };
      throw error;
    }
    if (!credentials.email?.trim()) {
      const error: ApiError = { error: 'validation failed', fields: { email: 'is required' } };
      throw error;
    }
    if (!credentials.password || credentials.password.length < 6) {
      const error: ApiError = { error: 'validation failed', fields: { password: 'must be at least 6 characters' } };
      throw error;
    }

    // Check if email exists
    const existingUser = users.find((u) => u.email === credentials.email);
    if (existingUser) {
      const error: ApiError = { error: 'validation failed', fields: { email: 'already registered' } };
      throw error;
    }

    // Create user
    const newUser = {
      id: generateId(),
      name: credentials.name.trim(),
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    };
    users.push(newUser);

    const { password: _, ...user } = newUser;
    const token = generateToken(user.id);

    setStoredAuth(token, user);

    return { token, user };
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(DELAY_MS);

    // Validation
    if (!credentials.email?.trim()) {
      const error: ApiError = { error: 'validation failed', fields: { email: 'is required' } };
      throw error;
    }
    if (!credentials.password) {
      const error: ApiError = { error: 'validation failed', fields: { password: 'is required' } };
      throw error;
    }

    // Find user
    const foundUser = users.find(
      (u) => u.email === credentials.email.toLowerCase() && u.password === credentials.password
    );
    if (!foundUser) {
      const error: ApiError = { error: 'Invalid email or password' };
      throw error;
    }

    const { password: _, ...user } = foundUser;
    const token = generateToken(user.id);

    setStoredAuth(token, user);

    return { token, user };
  },

  logout(): void {
    clearStoredAuth();
  },
};

// Projects API
export const projectsApi = {
  async getAll(): Promise<Project[]> {
    await delay(DELAY_MS);
    checkAuth();
    return [...projects];
  },

  async getById(id: string): Promise<ProjectWithTasks> {
    await delay(DELAY_MS);
    checkAuth();

    const project = projects.find((p) => p.id === id);
    if (!project) {
      const error: ApiError = { error: 'not found' };
      throw error;
    }

    const projectTasks = tasks.filter((t) => t.project_id === id);
    return { ...project, tasks: projectTasks };
  },

  async create(input: CreateProjectInput): Promise<Project> {
    await delay(DELAY_MS);
    checkAuth();

    if (!input.name?.trim()) {
      const error: ApiError = { error: 'validation failed', fields: { name: 'is required' } };
      throw error;
    }

    const auth = getStoredAuth();
    const newProject: Project = {
      id: generateId(),
      name: input.name.trim(),
      description: input.description?.trim() || '',
      owner_id: auth?.user.id || '',
      created_at: new Date().toISOString(),
    };
    projects.push(newProject);

    return newProject;
  },

  async update(id: string, input: Partial<CreateProjectInput>): Promise<Project> {
    await delay(DELAY_MS);
    checkAuth();

    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) {
      const error: ApiError = { error: 'not found' };
      throw error;
    }

    projects[index] = {
      ...projects[index],
      ...(input.name && { name: input.name.trim() }),
      ...(input.description !== undefined && { description: input.description.trim() }),
    };

    return projects[index];
  },

  async delete(id: string): Promise<void> {
    await delay(DELAY_MS);
    checkAuth();

    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) {
      const error: ApiError = { error: 'not found' };
      throw error;
    }

    projects.splice(index, 1);
    tasks = tasks.filter((t) => t.project_id !== id);
  },
};

// Tasks API
export const tasksApi = {
  async getByProject(projectId: string, filters?: TaskFilters): Promise<Task[]> {
    await delay(DELAY_MS);
    checkAuth();

    let projectTasks = tasks.filter((t) => t.project_id === projectId);

    if (filters?.status) {
      projectTasks = projectTasks.filter((t) => t.status === filters.status);
    }
    if (filters?.assignee) {
      projectTasks = projectTasks.filter((t) => t.assignee_id === filters.assignee);
    }

    return projectTasks;
  },

  async create(projectId: string, input: CreateTaskInput): Promise<Task> {
    await delay(DELAY_MS);
    checkAuth();

    if (!input.title?.trim()) {
      const error: ApiError = { error: 'validation failed', fields: { title: 'is required' } };
      throw error;
    }

    const now = new Date().toISOString();
    const newTask: Task = {
      id: generateId(),
      title: input.title.trim(),
      description: input.description?.trim(),
      status: input.status || 'todo',
      priority: input.priority || 'medium',
      assignee_id: input.assignee_id,
      due_date: input.due_date,
      created_at: now,
      updated_at: now,
      project_id: projectId,
    };
    tasks.push(newTask);

    return newTask;
  },

  async update(taskId: string, input: UpdateTaskInput): Promise<Task> {
    await delay(DELAY_MS);
    checkAuth();

    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) {
      const error: ApiError = { error: 'not found' };
      throw error;
    }

    tasks[index] = {
      ...tasks[index],
      ...input,
      updated_at: new Date().toISOString(),
    };

    return tasks[index];
  },

  async delete(taskId: string): Promise<void> {
    await delay(DELAY_MS);
    checkAuth();

    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) {
      const error: ApiError = { error: 'not found' };
      throw error;
    }

    tasks.splice(index, 1);
  },
};

// Users API (for assignee dropdown)
export const usersApi = {
  async getAll(): Promise<User[]> {
    await delay(DELAY_MS / 2);
    checkAuth();
    return users.map(({ password: _, ...user }) => user);
  },
};
