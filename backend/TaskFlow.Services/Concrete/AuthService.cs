using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TaskFlow.Models.DTOs;
using TaskFlow.Models.Entities;
using TaskFlow.Repository.Context;
using TaskFlow.Services.Abstract;
using TaskFlow.Repository.Abstract;

namespace TaskFlow.Services.Concrete
{
    public class AuthService : IAuthService
    {
        private readonly TaskFlowDbContext _context;
        private readonly IConfiguration _config;
        private readonly IUserRepository _userRepository;

        public AuthService(TaskFlowDbContext context, IConfiguration config,IUserRepository userRepository)
        {
            _context = context;
            _config = config;
            _userRepository = userRepository;
        }

        // ---------------- REGISTER ----------------
        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            var existingUser = await _userRepository.GetByEmailAsync(request.Email);

            if (existingUser != null)
                throw new Exception("Email already exists");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Email = request.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password, 12),
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.AddAsync(user);

            var token = GenerateJwtToken(user);

            return new AuthResponse
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email,
                Success = true,
                Message = "Registered successful"
            };
        }

        // ---------------- LOGIN ----------------
        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);

            if (user == null)
                throw new Exception("Invalid credentials");

            var isValid = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);

            if (!isValid)
                throw new Exception("Invalid credentials");

            var token = GenerateJwtToken(user);

            return new AuthResponse
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email,
                Success = true,
                Message = "Login successful"
            };
        }

        // ---------------- JWT GENERATION ----------------
        private string GenerateJwtToken(User user)
        {
            var key = _config.GetValue<string>("Jwt:Key")
         ?? throw new Exception("JWT Key not configured");

            var securityKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(key)
            );

            var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim("user_id", user.Id.ToString()),
            new Claim("email", user.Email)
        };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
