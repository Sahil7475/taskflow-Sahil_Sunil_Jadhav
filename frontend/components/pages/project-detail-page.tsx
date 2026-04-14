import { useState, useEffect, useCallback, DragEvent } from 'react';
import { Link } from 'react-router-dom';
import { projectsApi, tasksApi, usersApi } from '@/lib/api';
import { isApiError } from '@/contexts/auth-context';
import type { ProjectWithTasks, Task, User, TaskStatus, TaskFilters } from '@/lib/types';
import { useDragDrop } from '@/hooks/use-drag-drop';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Empty } from '@/components/ui/empty';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskCard } from '@/components/task-card';
import { TaskDialog } from '@/components/task-dialog';
import { Plus, ArrowLeft, AlertCircle, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_COLUMNS: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'todo', label: 'To Do', color: 'bg-slate-500' },
  { key: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
  { key: 'done', label: 'Done', color: 'bg-green-500' },
];

interface ProjectDetailPageProps {
  projectId: string;
}

export function ProjectDetailPage({ projectId }: ProjectDetailPageProps) {
  const [project, setProject] = useState<ProjectWithTasks | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({});

  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    try {
      setIsLoading(true);
      setError(null);
      const [projectData, usersData] = await Promise.all([projectsApi.getById(projectId), usersApi.getAll()]);
      setProject(projectData);
      setUsers(usersData);
    } catch (err) {
      if (isApiError(err)) {
        setError(err.error);
      } else {
        setError('Failed to load project');
      }
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleTaskCreated = (task: Task) => {
    setProject((prev) => (prev ? { ...prev, tasks: [...prev.tasks, task] } : prev));
    setIsTaskDialogOpen(false);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setProject((prev) =>
      prev
        ? {
            ...prev,
            tasks: prev.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
          }
        : prev
    );
    setEditingTask(null);
  };

  const handleTaskDeleted = (taskId: string) => {
    setProject((prev) =>
      prev
        ? {
            ...prev,
            tasks: prev.tasks.filter((t) => t.id !== taskId),
          }
        : prev
    );
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    // Optimistic update
    setProject((prev) =>
      prev
        ? {
            ...prev,
            tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
          }
        : prev
    );

    try {
      await tasksApi.update(taskId, { status: newStatus });
    } catch {
      // Revert on error
      fetchProject();
    }
  };

  const handleTaskMove = async (taskId: string, newStatus: TaskStatus, targetTaskId?: string) => {
    if (!project) return;

    // Find the task being moved
    const taskToMove = project.tasks.find((t) => t.id === taskId);
    if (!taskToMove) return;

    // Create new tasks array with updated status and position
    let newTasks = project.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));

    // If dropping on a specific task, reorder
    if (targetTaskId) {
      const filteredTasks = newTasks.filter((t) => t.id !== taskId);
      const targetIndex = filteredTasks.findIndex((t) => t.id === targetTaskId);
      if (targetIndex !== -1) {
        filteredTasks.splice(targetIndex, 0, { ...taskToMove, status: newStatus });
        newTasks = filteredTasks;
      }
    }

    // Optimistic update
    setProject((prev) => (prev ? { ...prev, tasks: newTasks } : prev));

    try {
      await tasksApi.update(taskId, { status: newStatus });
    } catch {
      // Revert on error
      fetchProject();
    }
  };

  const handleReorder = (taskId: string, targetTaskId: string, status: TaskStatus) => {
    if (!project) return;

    const taskToMove = project.tasks.find((t) => t.id === taskId);
    if (!taskToMove) return;

    const filteredTasks = project.tasks.filter((t) => t.id !== taskId);
    const targetIndex = filteredTasks.findIndex((t) => t.id === targetTaskId);
    
    if (targetIndex !== -1) {
      filteredTasks.splice(targetIndex, 0, { ...taskToMove, status });
      setProject((prev) => (prev ? { ...prev, tasks: filteredTasks } : prev));
    }
  };

  const { state: dragState, handleDragStart, handleDragEnd, handleDragOver, handleDrop } = useDragDrop({
    onTaskMove: handleTaskMove,
    onReorder: handleReorder,
  });

  const filteredTasks = project?.tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.assignee && task.assignee_id !== filters.assignee) return false;
    return true;
  });

  const getTasksByStatus = (status: TaskStatus) => filteredTasks?.filter((t) => t.status === status) || [];

  const getAssigneeName = (assigneeId?: string) => {
    if (!assigneeId) return 'Unassigned';
    return users.find((u) => u.id === assigneeId)?.name || 'Unknown';
  };

  const handleColumnDragOver = (e: DragEvent<HTMLDivElement>, column: TaskStatus) => {
    e.preventDefault();
    handleDragOver(e, column);
  };

  const handleColumnDrop = (e: DragEvent<HTMLDivElement>, column: TaskStatus) => {
    e.preventDefault();
    handleDrop(e, column);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Project not found'}</AlertDescription>
        </Alert>
        <Link to="/projects" className="mt-4 inline-block">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/projects">
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{project.name}</h1>
            {project.description && <p className="mt-1 text-muted-foreground">{project.description}</p>}
          </div>
          <Button onClick={() => setIsTaskDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Select
          value={filters.status || 'all'}
          onValueChange={(val) => setFilters((prev) => ({ ...prev, status: val === 'all' ? undefined : (val as TaskStatus) }))}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.assignee || 'all'}
          onValueChange={(val) => setFilters((prev) => ({ ...prev, assignee: val === 'all' ? undefined : val }))}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Assignees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(filters.status || filters.assignee) && (
          <Button variant="ghost" size="sm" onClick={() => setFilters({})}>
            Clear filters
          </Button>
        )}
      </div>

      {/* Kanban Board */}
      {project.tasks.length === 0 ? (
        <Empty className="py-12">
          <ListTodo className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No tasks yet</h3>
          <p className="mt-2 text-muted-foreground">Create your first task to get started</p>
          <Button className="mt-4" onClick={() => setIsTaskDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {STATUS_COLUMNS.map((column) => (
            <Card
              key={column.key}
              className={cn(
                'flex flex-col transition-all duration-200',
                dragState.dragOverColumn === column.key && dragState.draggedTask?.status !== column.key && 'ring-2 ring-primary bg-primary/5'
              )}
              onDragOver={(e) => handleColumnDragOver(e, column.key)}
              onDragLeave={() => {}}
              onDrop={(e) => handleColumnDrop(e, column.key)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${column.color}`} />
                  <CardTitle className="text-sm font-medium">{column.label}</CardTitle>
                  <Badge variant="secondary" className="ml-auto">
                    {getTasksByStatus(column.key).length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-3 min-h-[100px]">
                {getTasksByStatus(column.key).length === 0 ? (
                  <div className="flex h-full items-center justify-center rounded-md border-2 border-dashed border-muted py-8">
                    <p className="text-sm text-muted-foreground">
                      {dragState.draggedTask ? 'Drop here' : 'No tasks'}
                    </p>
                  </div>
                ) : (
                  getTasksByStatus(column.key).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      assigneeName={getAssigneeName(task.assignee_id)}
                      onEdit={() => setEditingTask(task)}
                      onStatusChange={handleStatusChange}
                      onDelete={handleTaskDeleted}
                      isDragging={dragState.draggedTask?.id === task.id}
                      isDragOver={dragState.dragOverTaskId === task.id}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, column.key, task.id)}
                      onDrop={(e) => handleDrop(e, column.key, task.id)}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Task Dialog */}
      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        projectId={project.id}
        users={users}
        onSuccess={handleTaskCreated}
      />

      {/* Edit Task Dialog */}
      <TaskDialog
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        projectId={project.id}
        users={users}
        task={editingTask}
        onSuccess={handleTaskUpdated}
      />
    </div>
  );
}
