using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace Users.DTO
{
    public class UserCreate
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
    }
}