using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskFlow.Models.DTOs
{
    public class AuthResponse
    {
        public string Token { get; set; } = null!;
        public Guid UserId { get; set; }
        public string Email { get; set; } = null!;
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
    }
}
