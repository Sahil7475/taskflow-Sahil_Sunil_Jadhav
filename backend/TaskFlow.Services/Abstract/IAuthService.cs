using TaskFlow.Models.DTOs;

namespace TaskFlow.Services.Abstract
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
    }
}
