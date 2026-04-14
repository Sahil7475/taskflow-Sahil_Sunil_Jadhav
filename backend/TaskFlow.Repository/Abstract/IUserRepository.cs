using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskFlow.Models.Entities;

namespace TaskFlow.Repository.Abstract
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        System.Threading.Tasks.Task AddAsync(User user);
    }
}
