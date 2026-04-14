using Microsoft.EntityFrameworkCore;
using TaskFlow.Models.Entities;
using TaskFlow.Repository.Abstract;
using TaskFlow.Repository.Context;

namespace TaskFlow.Repository.Concrete
{
    public class UserRepository : IUserRepository
    {
        private readonly TaskFlowDbContext _context;

        public UserRepository(TaskFlowDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async System.Threading.Tasks.Task AddAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
    }
}
