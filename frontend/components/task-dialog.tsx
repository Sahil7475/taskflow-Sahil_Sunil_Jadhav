import { useState, useEffect } from 'react';
import { tasksApi } from '@/lib/api';
import { isApiError } from '@/contexts/auth-context';
import type { Task, User, TaskStatus, TaskPriority, CreateTaskInput } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  users: User[];
  task?: Task | null;
  onSuccess: (task: Task) => void;
}

const INITIAL_FORM: CreateTaskInput = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  assignee_id: undefined,
  due_date: undefined,
};

export function TaskDialog({ open, onOpenChange, projectId, users, task, onSuccess }: TaskDialogProps) {
  const isEditing = !!task;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CreateTaskInput>(INITIAL_FORM);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        assignee_id: task.assignee_id,
        due_date: task.due_date,
      });
    } else {
      setFormData(INITIAL_FORM);
    }
  }, [task, open]);

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setError(null);
    setFieldErrors({});
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) resetForm();
    onOpenChange(newOpen);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) {
      errors.title = 'Task title is required';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let result: Task;
      if (isEditing && task) {
        result = await tasksApi.update(task.id, {
          title: formData.title.trim(),
          description: formData.description?.trim(),
          status: formData.status,
          priority: formData.priority,
          assignee_id: formData.assignee_id,
          due_date: formData.due_date,
        });
      } else {
        result = await tasksApi.create(projectId, {
          title: formData.title.trim(),
          description: formData.description?.trim(),
          status: formData.status,
          priority: formData.priority,
          assignee_id: formData.assignee_id,
          due_date: formData.due_date,
        });
      }
      onSuccess(result);
      resetForm();
    } catch (err) {
      if (isApiError(err)) {
        if (err.fields) {
          setFieldErrors(err.fields);
        } else {
          setError(err.error);
        }
      } else {
        setError('Failed to save task');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = <K extends keyof CreateTaskInput>(field: K, value: CreateTaskInput[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'title') {
      setFieldErrors((prev) => ({ ...prev, title: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Task' : 'Create Task'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the task details' : 'Add a new task to this project'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="task-title">Title</FieldLabel>
                <Input
                  id="task-title"
                  placeholder="Enter task title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  aria-invalid={!!fieldErrors.title}
                  disabled={isLoading}
                />
                {fieldErrors.title && <p className="text-sm text-destructive">{fieldErrors.title}</p>}
              </Field>

              <Field>
                <FieldLabel htmlFor="task-description">Description (optional)</FieldLabel>
                <Textarea
                  id="task-description"
                  placeholder="Describe the task"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                  disabled={isLoading}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="task-status">Status</FieldLabel>
                  <Select
                    value={formData.status}
                    onValueChange={(val) => updateField('status', val as TaskStatus)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="task-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="task-priority">Priority</FieldLabel>
                  <Select
                    value={formData.priority}
                    onValueChange={(val) => updateField('priority', val as TaskPriority)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="task-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="task-assignee">Assignee</FieldLabel>
                  <Select
                    value={formData.assignee_id || 'unassigned'}
                    onValueChange={(val) => updateField('assignee_id', val === 'unassigned' ? undefined : val)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="task-assignee">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="task-due-date">Due Date</FieldLabel>
                  <Input
                    id="task-due-date"
                    type="date"
                    value={formData.due_date || ''}
                    onChange={(e) => updateField('due_date', e.target.value || undefined)}
                    disabled={isLoading}
                  />
                </Field>
              </div>
            </FieldGroup>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
              {isEditing ? 'Save Changes' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
