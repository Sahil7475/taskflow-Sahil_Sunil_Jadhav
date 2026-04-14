using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskFlow.Models.DTOs.Project
{
    public class ProjectCreateRequest
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
    }
}
