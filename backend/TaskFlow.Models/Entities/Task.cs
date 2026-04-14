using TaskFlow.Models.Enums;

namespace TaskFlow.Models.Entities
{
    public class Task
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }

        public Enums.TaskStatus Status { get; set; } = Enums.TaskStatus.todo;
        public TaskPriority Priority { get; set; } = TaskPriority.medium;

        public Guid ProjectId { get; set; }
        public Guid? AssigneeId { get; set; }

        public DateTime? DueDate { get; set; }

        public DateTime CreatedAt { get; set; } 
        public DateTime UpdatedAt { get; set; }
        public Project Project { get; set; } = null!;
        public User? Assignee { get; set; }
    }
}
