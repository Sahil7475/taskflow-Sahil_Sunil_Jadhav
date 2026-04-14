using TaskFlow.Models.DTOs.Task;
using TaskFlow.Models.Enums;
using TaskFlow.Repository.Abstract;
using TaskFlow.Services.Abstract;

namespace TaskFlow.Services.Concrete
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _taskRepo;
        private readonly IProjectRepository _projectRepo;

        public TaskService(ITaskRepository taskRepo, IProjectRepository projectRepo)
        {
            _taskRepo = taskRepo;
            _projectRepo = projectRepo;
        }

        public async Task<List<TaskResponse>> GetTasksAsync(Guid projectId, string? status, Guid? assignee)
        {
            var tasks = await _taskRepo.GetByProjectIdAsync(projectId);

            if (!string.IsNullOrEmpty(status))
                tasks = tasks.Where(t => t.Status.ToString() == status).ToList();

            if (assignee.HasValue)
                tasks = tasks.Where(t => t.AssigneeId == assignee).ToList();

            return tasks.Select(t => new TaskResponse
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status,
                Priority = t.Priority,
                ProjectId = t.ProjectId,
                AssigneeId = t.AssigneeId,
                DueDate = t.DueDate
            }).ToList();
        }

        public async Task<TaskResponse> CreateTaskAsync(Guid projectId, Guid userId, TaskCreateRequest request)
        {
            var task = new Models.Entities.Task
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Description = request.Description,
                Status = request.Status,
                Priority = request.Priority,
                ProjectId = projectId,
                AssigneeId = request.AssigneeId,
                DueDate = request.DueDate,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _taskRepo.AddAsync(task);

            return new TaskResponse
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                Priority = task.Priority,
                ProjectId = task.ProjectId,
                AssigneeId = task.AssigneeId,
                DueDate = task.DueDate
            };
        }

        public async Task<bool> UpdateTaskAsync(Guid taskId, TaskUpdateRequest request)
        {
            var task = await _taskRepo.GetByIdAsync(taskId);

            if (task == null)
                return false;

            task.Title = request.Title;
            task.Description = request.Description;
            task.Status = Enum.Parse<Models.Enums.TaskStatus>(request.Status);
            task.Priority = Enum.Parse<TaskPriority>(request.Priority);
            task.AssigneeId = request.AssigneeId;
            task.DueDate = request.DueDate;
            task.UpdatedAt = DateTime.UtcNow;

            await _taskRepo.UpdateAsync(task);
            return true;
        }

        public async Task<bool> DeleteTaskAsync(Guid taskId, Guid userId)
        {
            var task = await _taskRepo.GetByIdAsync(taskId);
            if (task == null) return false;

            var project = await _projectRepo.GetByIdAsync(task.ProjectId);

            if (project == null)
                return false;

            if (project.OwnerId != userId && task.AssigneeId != userId)
                return false;

            await _taskRepo.DeleteAsync(task);
            return true;
        }
    }
}
