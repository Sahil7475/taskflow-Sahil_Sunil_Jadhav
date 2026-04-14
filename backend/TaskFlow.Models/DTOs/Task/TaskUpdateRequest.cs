using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskFlow.Models.DTOs.Task
{
    public class TaskUpdateRequest
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }

        public string Status { get; set; }
        public string Priority { get; set; }

        public Guid? AssigneeId { get; set; }
        public DateTime? DueDate { get; set; }
    }
}
