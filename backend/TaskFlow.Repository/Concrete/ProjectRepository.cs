using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskFlow.Repository.Concrete
{
    using Microsoft.EntityFrameworkCore;
    using TaskFlow.Models.Entities;
    using TaskFlow.Repository.Abstract;
    using TaskFlow.Repository.Context;

    public class ProjectRepository : IProjectRepository
    {
        private readonly TaskFlowDbContext _context;

        public ProjectRepository(TaskFlowDbContext context)
        {
            _context = context;
        }

        public async Task<Project?> GetByIdAsync(Guid id)
        {
            return await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<List<Project>> GetByOwnerIdAsync(Guid ownerId)
        {
            return await _context.Projects
                .Where(p => p.OwnerId == ownerId)
                .ToListAsync();
        }

        public async System.Threading.Tasks.Task AddAsync(Project project)
        {
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
        }

        public async System.Threading.Tasks.Task UpdateAsync(Project project)
        {
            _context.Projects.Update(project);
            await _context.SaveChangesAsync();
        }

        public async System.Threading.Tasks.Task DeleteAsync(Project project)
        {
            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
        }
    }
}
