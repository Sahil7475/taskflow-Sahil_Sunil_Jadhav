using Microsoft.EntityFrameworkCore;
using TaskFlow.Models.Entities;
using TaskFlow.Models.Enums;

namespace TaskFlow.Repository.Context
{
    public class TaskFlowDbContext : DbContext
    {
        public TaskFlowDbContext(DbContextOptions<TaskFlowDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Models.Entities.Task> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Name).HasColumnName("name").IsRequired();
                entity.Property(e => e.Email).HasColumnName("email").IsRequired();
                entity.Property(e => e.Password).HasColumnName("password").IsRequired();
                entity.Property(e => e.CreatedAt)
                      .HasColumnName("created_at")
                      .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasIndex(e => e.Email).IsUnique();
            });

            
            modelBuilder.Entity<Project>(entity =>
            {
                entity.ToTable("Project");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Name).HasColumnName("name").IsRequired();
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.OwnerId).HasColumnName("owner_id").IsRequired();
                entity.Property(e => e.CreatedAt)
                      .HasColumnName("created_at")
                      .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(e => e.Owner)
                             .WithMany(u => u.Projects)
                             .HasForeignKey(e => e.OwnerId)
                             .HasConstraintName("fk_project_owner")
                             .OnDelete(DeleteBehavior.Cascade);

                //entity.HasOne<User>()
                //      .WithMany()
                //      .HasForeignKey(e => e.OwnerId)
                //      .HasConstraintName("fk_project_owner")
                //      .OnDelete(DeleteBehavior.Cascade);
            });


            modelBuilder.Entity<Models.Entities.Task>(entity =>
            {
                entity.ToTable("Task");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Title).HasColumnName("title").IsRequired();
                entity.Property(e => e.Description).HasColumnName("description");

                entity.Property(e => e.Priority)
       .HasColumnName("priority")
       .HasColumnType("task_priority")
       .HasConversion<string>()   
       .HasDefaultValue(TaskPriority.medium);

                entity.Property(e => e.Status)
                    .HasColumnName("status")
                    .HasColumnType("task_status")
                    .HasConversion<string>()   
                    .HasDefaultValue(Models.Enums.TaskStatus.todo);



                entity.Property(e => e.ProjectId).HasColumnName("project_id").IsRequired();
                entity.Property(e => e.AssigneeId).HasColumnName("assignee_id");
                entity.Property(e => e.DueDate).HasColumnName("due_date");

                entity.Property(e => e.CreatedAt)
                      .HasColumnName("created_at")
                      .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedAt)
                      .HasColumnName("updated_at")
                      .HasDefaultValueSql("CURRENT_TIMESTAMP");

         
                entity.HasOne(e => e.Project)
                      .WithMany(p => p.Tasks)
                      .HasForeignKey(e => e.ProjectId)
                      .HasConstraintName("fk_task_project")
                      .OnDelete(DeleteBehavior.Cascade);

              
                entity.HasOne(e => e.Assignee)
                      .WithMany(u => u.AssignedTasks)
                      .HasForeignKey(e => e.AssigneeId)
                      .HasConstraintName("fk_task_assignee")
                      .OnDelete(DeleteBehavior.SetNull);

                
            });

           
            modelBuilder.HasPostgresEnum<Models.Enums.TaskStatus>();
            modelBuilder.HasPostgresEnum<TaskPriority>();
        }

    }
}
