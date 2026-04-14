using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskFlow.Models.DTOs.Project
{
    public class ProjectResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } =null!;
        public string? Description { get; set; }
        public Guid OwnerId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
