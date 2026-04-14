using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskFlow.Models.DTOs.Project;

namespace TaskFlow.Services.Abstract
{
    public interface IProjectService
    {
        Task<List<ProjectResponse>> GetUserProjectsAsync(Guid userId);
        Task<ProjectResponse> GetProjectByIdAsync(Guid id);

        Task<ProjectResponse> CreateProjectAsync(Guid userId, ProjectCreateRequest request);
        Task<bool> UpdateProjectAsync(Guid id, Guid userId, ProjectUpdateRequest request);
        Task<bool> DeleteProjectAsync(Guid id, Guid userId);
    }
}
