using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskFlow.Models.Enums;

namespace TaskFlow.Models.DTOs.Task
{
    public class TaskResponse
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }

        public Models.Enums.TaskStatus Status { get; set; }
        public TaskPriority Priority { get; set; }

        public Guid ProjectId { get; set; }
        public Guid? AssigneeId { get; set; }

        public DateTime? DueDate { get; set; }
    }
}
