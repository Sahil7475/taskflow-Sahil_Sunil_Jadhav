using TaskFlow.Models.DTOs.Project;
using TaskFlow.Models.Entities;
using TaskFlow.Repository.Abstract;
using TaskFlow.Services.Abstract;

namespace TaskFlow.Services.Concrete
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _projectRepo;

        public ProjectService(IProjectRepository projectRepo)
        {
            _projectRepo = projectRepo;
        }

        public async Task<List<ProjectResponse>> GetUserProjectsAsync(Guid userId)
        {
            var projects = await _projectRepo.GetByOwnerIdAsync(userId);

            return projects.Select(p => new ProjectResponse
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                OwnerId = p.OwnerId,
                CreatedAt = p.CreatedAt
            }).ToList();
        }

        public async Task<ProjectResponse> GetProjectByIdAsync(Guid id)
        {
            var project = await _projectRepo.GetByIdAsync(id);

            if (project == null)
                throw new Exception("Project not found");

            return new ProjectResponse
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                OwnerId = project.OwnerId,
                CreatedAt = project.CreatedAt
            };
        }

        public async Task<ProjectResponse> CreateProjectAsync(Guid userId, ProjectCreateRequest request)
        {
            var project = new Project
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                OwnerId = userId,
                CreatedAt = DateTime.UtcNow
            };

            await _projectRepo.AddAsync(project);

            return new ProjectResponse
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                OwnerId = project.OwnerId,
                CreatedAt = project.CreatedAt
            };
        }

        public async Task<bool> UpdateProjectAsync(Guid id, Guid userId, ProjectUpdateRequest request)
        {
            var project = await _projectRepo.GetByIdAsync(id);

            if (project == null || project.OwnerId != userId)
                return false;

            project.Name = request.Name;
            project.Description = request.Description;

            await _projectRepo.UpdateAsync(project);
            return true;
        }

        public async Task<bool> DeleteProjectAsync(Guid id, Guid userId)
        {
            var project = await _projectRepo.GetByIdAsync(id);

            if (project == null || project.OwnerId != userId)
                return false;

            await _projectRepo.DeleteAsync(project);
            return true;
        }
    }
}
