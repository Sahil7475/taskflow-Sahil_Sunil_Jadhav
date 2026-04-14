import type { User, Project, Task } from './types';

// Mock users database
export const mockUsers: (User & { password: string })[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
  },
];

// Mock projects database
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website for Q2 launch',
    owner_id: 'user-1',
    created_at: '2026-04-01T10:00:00Z',
  },
  {
    id: 'project-2',
    name: 'Mobile App Development',
    description: 'Native iOS and Android app for customer engagement',
    owner_id: 'user-1',
    created_at: '2026-04-02T14:30:00Z',
  },
  {
    id: 'project-3',
    name: 'API Integration',
    description: 'Third-party payment gateway integration',
    owner_id: 'user-2',
    created_at: '2026-04-03T09:15:00Z',
  },
];

// Mock tasks database
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design homepage mockups',
    description: 'Create initial wireframes and high-fidelity mockups for the new homepage',
    status: 'done',
    priority: 'high',
    assignee_id: 'user-2',
    due_date: '2026-04-10',
    created_at: '2026-04-01T10:30:00Z',
    updated_at: '2026-04-05T16:00:00Z',
    project_id: 'project-1',
  },
  {
    id: 'task-2',
    title: 'Implement responsive navigation',
    description: 'Build mobile-first responsive navigation component',
    status: 'in_progress',
    priority: 'high',
    assignee_id: 'user-1',
    due_date: '2026-04-15',
    created_at: '2026-04-02T11:00:00Z',
    updated_at: '2026-04-08T10:00:00Z',
    project_id: 'project-1',
  },
  {
    id: 'task-3',
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment',
    status: 'todo',
    priority: 'medium',
    assignee_id: 'user-1',
    due_date: '2026-04-20',
    created_at: '2026-04-03T09:00:00Z',
    updated_at: '2026-04-03T09:00:00Z',
    project_id: 'project-1',
  },
  {
    id: 'task-4',
    title: 'User authentication flow',
    description: 'Implement login, register, and password reset screens',
    status: 'in_progress',
    priority: 'high',
    assignee_id: 'user-2',
    due_date: '2026-04-18',
    created_at: '2026-04-02T15:00:00Z',
    updated_at: '2026-04-10T11:30:00Z',
    project_id: 'project-2',
  },
  {
    id: 'task-5',
    title: 'Push notifications setup',
    description: 'Configure Firebase for push notifications',
    status: 'todo',
    priority: 'low',
    assignee_id: 'user-1',
    due_date: '2026-04-25',
    created_at: '2026-04-03T10:00:00Z',
    updated_at: '2026-04-03T10:00:00Z',
    project_id: 'project-2',
  },
  {
    id: 'task-6',
    title: 'Stripe integration',
    description: 'Implement Stripe payment processing',
    status: 'in_progress',
    priority: 'high',
    assignee_id: 'user-1',
    due_date: '2026-04-12',
    created_at: '2026-04-03T09:30:00Z',
    updated_at: '2026-04-09T14:00:00Z',
    project_id: 'project-3',
  },
  {
    id: 'task-7',
    title: 'Payment webhook handlers',
    description: 'Handle payment success, failure, and refund webhooks',
    status: 'todo',
    priority: 'medium',
    assignee_id: 'user-2',
    due_date: '2026-04-16',
    created_at: '2026-04-04T08:00:00Z',
    updated_at: '2026-04-04T08:00:00Z',
    project_id: 'project-3',
  },
];

// Helper to generate UUIDs
export function generateId(): string {
  return 'id-' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

// Helper to generate mock JWT
export function generateToken(userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: userId, exp: Date.now() + 86400000 }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
}
