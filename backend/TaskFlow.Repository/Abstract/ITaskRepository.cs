

namespace TaskFlow.Repository.Abstract
{
    public interface ITaskRepository
    {
        Task<List<Models.Entities.Task>> GetByProjectIdAsync(Guid projectId);
        Task<Models.Entities.Task?> GetByIdAsync(Guid id);

        System.Threading.Tasks.Task AddAsync(Models.Entities.Task task);
        System.Threading.Tasks.Task UpdateAsync(Models.Entities.Task task);
        System.Threading.Tasks.Task DeleteAsync(Models.Entities.Task task);
    }
}
