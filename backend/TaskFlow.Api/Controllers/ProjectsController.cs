using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Services.Abstract;
using TaskFlow.Models.DTOs.Project;

namespace TaskFlow.Api.Controllers
{
    [ApiController]
    [Route("projects")]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        public async Task<ActionResult> GetProjects()
        {
            var userId = User.FindFirst("user_id")?.Value;

            var result = await _projectService.GetUserProjectsAsync(Guid.Parse(userId));

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult> Create(ProjectCreateRequest request)
        {
            var userId = Guid.Parse(User.FindFirst("user_id")?.Value);

            var result = await _projectService.CreateProjectAsync(userId, request);

            return CreatedAtAction(nameof(GetProjectById), new { id = result.Id }, result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetProjectById(Guid id)
        {
            var result = await _projectService.GetProjectByIdAsync(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult> Update(Guid id, ProjectUpdateRequest request)
        {
            var userId = Guid.Parse(User.FindFirst("user_id")?.Value);

            var success = await _projectService.UpdateProjectAsync(id, userId, request);

            if (!success)
                return Forbid();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var userId = Guid.Parse(User.FindFirst("user_id")?.Value);

            var success = await _projectService.DeleteProjectAsync(id, userId);

            if (!success)
                return Forbid();

            return NoContent();
        }

    }
}
