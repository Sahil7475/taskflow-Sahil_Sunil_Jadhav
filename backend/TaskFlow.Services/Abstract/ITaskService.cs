using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskFlow.Models.DTOs.Task;

namespace TaskFlow.Services.Abstract
{
    public interface ITaskService
    {
        Task<List<TaskResponse>> GetTasksAsync(Guid projectId, string? status, Guid? assignee);
        Task<TaskResponse> CreateTaskAsync(Guid projectId, Guid userId, TaskCreateRequest request);

        Task<bool> UpdateTaskAsync(Guid taskId, TaskUpdateRequest request);
        Task<bool> DeleteTaskAsync(Guid taskId, Guid userId);
    }
}
