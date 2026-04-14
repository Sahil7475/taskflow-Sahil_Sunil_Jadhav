using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Models.DTOs.Task;
using TaskFlow.Services.Abstract;

namespace TaskFlow.Api.Controllers
{
    [ApiController]
    [Route("")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet("projects/{Id}/tasks")]
        public async Task<ActionResult> GetTasks(Guid Id, string? status, Guid? assignee)
        {
            var result = await _taskService.GetTasksAsync(Id, status, assignee);
            return Ok(result);
        }

        [HttpPost("projects/{Id}/tasks")]
        public async Task<ActionResult> Create(Guid Id, TaskCreateRequest request)
        {
            var userId = Guid.Parse(User.FindFirst("user_id")!.Value);

            var result = await _taskService.CreateTaskAsync(Id, userId, request);

            return Ok(result);
        }

        [HttpPatch("tasks/{id}")]
        public async Task<ActionResult> Update(Guid id, TaskUpdateRequest request)
        {
            var success = await _taskService.UpdateTaskAsync(id, request);

            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("tasks/{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var userId = Guid.Parse(User.FindFirst("user_id")!.Value);

            var success = await _taskService.DeleteTaskAsync(id, userId);

            if (!success)
                return Forbid();

            return NoContent();
        }
    }
}
